from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import sqlite3


app = FastAPI()

# Allowed origins for CORS
allow_origins = ["http://localhost:8000", "http://192.168.1.6:8081"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection helper
def get_db_connection():
    connection = sqlite3.connect("quiz_app.sqlite3")
    connection.row_factory = sqlite3.Row
    return connection

# Models
class Quiz(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    level: str
    topic: str
    questions: List[dict]  # List of question objects

class Question(BaseModel):
    question_text: str
    choices: List[str]
    correct_answer: str

class Attempt(BaseModel):
    quiz_id: int
    user_answers: List[str]

class Category(BaseModel):
    name: str
    description: Optional[str] = None

class Level(BaseModel):
    name: str
    description: Optional[str] = None

class Topic(BaseModel):
    name: str
    description: Optional[str] = None

# Database initialization
def initialize_db():
    connection = get_db_connection()
    cursor = connection.cursor()

    # Categories Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        )
    ''')

    # Levels Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS levels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        )
    ''')

    # Topics Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        )
    ''')

    # Quizzes Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quizzes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category_id INTEGER,
            level_id INTEGER,
            topic_id INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories(id),
            FOREIGN KEY (level_id) REFERENCES levels(id),
            FOREIGN KEY (topic_id) REFERENCES topics(id)
        )
    ''')

    # Questions Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quiz_id INTEGER NOT NULL,
            question_text TEXT NOT NULL,
            choices TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
        )
    ''')

    # Attempts Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quiz_id INTEGER NOT NULL,
            user_answers TEXT NOT NULL,
            score INTEGER NOT NULL,
            FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
        )
    ''')

    connection.commit()
    connection.close()

# Uncomment the line below to initialize the database
# initialize_db()

# Category CRUD
@app.post("/categories")
async def create_category(category: Category):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO categories (name, description) VALUES (?, ?)", (category.name, category.description))
    connection.commit()
    connection.close()
    return {"message": "Category created successfully"}

@app.get("/categories/{category_id}")
async def get_category(category_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM categories WHERE id = ?", (category_id,))
    category = cursor.fetchone()
    connection.close()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return dict(category)

@app.put("/categories/{category_id}")
async def update_category(category_id: int, category: Category):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE categories SET name = ?, description = ? WHERE id = ?", (category.name, category.description, category_id))
    connection.commit()
    connection.close()
    return {"message": "Category updated successfully"}

@app.delete("/categories/{category_id}")
async def delete_category(category_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM categories WHERE id = ?", (category_id,))
    connection.commit()
    connection.close()
    return {"message": "Category deleted successfully"}

# Quiz CRUD
@app.post("/quizzes")
async def create_quiz(quiz: Quiz):
    if len(quiz.questions) > 10:
        raise HTTPException(status_code=400, detail="A quiz can have a maximum of 10 questions.")

    connection = get_db_connection()
    cursor = connection.cursor()

    # Ensure category, level, and topic exist
    cursor.execute("SELECT id FROM categories WHERE name = ?", (quiz.category,))
    category_row = cursor.fetchone()
    if not category_row:
        cursor.execute("INSERT INTO categories (name) VALUES (?)", (quiz.category,))
        category_id = cursor.lastrowid
    else:
        category_id = category_row["id"]

    cursor.execute("SELECT id FROM levels WHERE name = ?", (quiz.level,))
    level_row = cursor.fetchone()
    if not level_row:
        cursor.execute("INSERT INTO levels (name) VALUES (?)", (quiz.level,))
        level_id = cursor.lastrowid
    else:
        level_id = level_row["id"]

    cursor.execute("SELECT id FROM topics WHERE name = ?", (quiz.topic,))
    topic_row = cursor.fetchone()
    if not topic_row:
        cursor.execute("INSERT INTO topics (name) VALUES (?)", (quiz.topic,))
        topic_id = cursor.lastrowid
    else:
        topic_id = topic_row["id"]

    # Insert quiz
    cursor.execute("""
        INSERT INTO quizzes (title, description, category_id, level_id, topic_id)
        VALUES (?, ?, ?, ?, ?)
    """, (quiz.title, quiz.description, category_id, level_id, topic_id))
    quiz_id = cursor.lastrowid

    # Insert questions
    for question in quiz.questions:
        cursor.execute("""
            INSERT INTO questions (quiz_id, question_text, choices, correct_answer)
            VALUES (?, ?, ?, ?)
        """, (quiz_id, question["question_text"], ",".join(question["choices"]), question["correct_answer"]))

    connection.commit()
    connection.close()
    return {"message": "Quiz created successfully", "quiz_id": quiz_id}

@app.get("/quizzes")
async def get_quizzes():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT quizzes.id, quizzes.title, categories.name AS category
        FROM quizzes
        JOIN categories ON quizzes.category_id = categories.id
    """)
    quizzes = cursor.fetchall()
    connection.close()
    return [dict(quiz) for quiz in quizzes]

@app.get("/quizzes/{quiz_id}")
async def get_quiz(quiz_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT quizzes.id, quizzes.title, quizzes.description, categories.name AS category,
               levels.name AS level, topics.name AS topic
        FROM quizzes
        JOIN categories ON quizzes.category_id = categories.id
        JOIN levels ON quizzes.level_id = levels.id
        JOIN topics ON quizzes.topic_id = topics.id
        WHERE quizzes.id = ?
    """, (quiz_id,))
    quiz = cursor.fetchone()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    cursor.execute("SELECT * FROM questions WHERE quiz_id = ?", (quiz_id,))
    questions = cursor.fetchall()

    connection.close()
    return {
        "id": quiz["id"],
        "title": quiz["title"],
        "description": quiz["description"],
        "category": quiz["category"],
        "level": quiz["level"],
        "topic": quiz["topic"],
        "questions": [dict(question) for question in questions]
    }

@app.get("/quizzes")
async def get_all_quizzes():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT quizzes.id, quizzes.title, quizzes.description, categories.name AS category,
               levels.name AS level, topics.name AS topic
        FROM quizzes
        JOIN categories ON quizzes.category_id = categories.id
        JOIN levels ON quizzes.level_id = levels.id
        JOIN topics ON quizzes.topic_id = topics.id
    """)
    quizzes = cursor.fetchall()

    connection.close()

    if not quizzes:
        return JSONResponse(content=[], status_code=200)

    return [dict(quiz) for quiz in quizzes]

@app.delete("/quizzes/{quiz_id}")
async def delete_quiz(quiz_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM quizzes WHERE id = ?", (quiz_id,))
    connection.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Quiz not found")

    connection.close()
    return {"message": "Quiz deleted successfully"}

@app.put("/quizzes/{quiz_id}")
async def update_quiz(quiz_id: int, quiz: Quiz):
    if len(quiz.questions) > 10:
        raise HTTPException(status_code=400, detail="A quiz can have a maximum of 10 questions.")

    connection = get_db_connection()
    cursor = connection.cursor()

    # Update quiz metadata
    cursor.execute("""
        UPDATE quizzes
        SET title = ?, description = ?, category_id = (SELECT id FROM categories WHERE name = ?),
            level_id = (SELECT id FROM levels WHERE name = ?), topic_id = (SELECT id FROM topics WHERE name = ?)
        WHERE id = ?
    """, (quiz.title, quiz.description, quiz.category, quiz.level, quiz.topic, quiz_id))

    # Update questions (delete existing and reinsert)
    cursor.execute("DELETE FROM questions WHERE quiz_id = ?", (quiz_id,))
    for question in quiz.questions:
        cursor.execute("""
            INSERT INTO questions (quiz_id, question_text, choices, correct_answer)
            VALUES (?, ?, ?, ?)
        """, (quiz_id, question["question_text"], ",".join(question["choices"]), question["correct_answer"]))

    connection.commit()
    connection.close()
    return {"message": "Quiz updated successfully"}

@app.delete("/quizzes/{quiz_id}")
async def delete_quiz(quiz_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM questions WHERE quiz_id = ?", (quiz_id,))
    cursor.execute("DELETE FROM quizzes WHERE id = ?", (quiz_id,))
    connection.commit()
    connection.close()
    return {"message": "Quiz deleted successfully"}

# Attempts
@app.post("/attempts")
async def save_attempt(attempt: Attempt):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT correct_answer FROM questions WHERE quiz_id = ?", (attempt.quiz_id,))
    correct_answers = [row["correct_answer"] for row in cursor.fetchall()]

    if not correct_answers:
        raise HTTPException(status_code=404, detail="No questions found for the specified quiz")

    score = sum(1 for user_answer, correct_answer in zip(attempt.user_answers, correct_answers) if user_answer == correct_answer)
    cursor.execute("""
        INSERT INTO attempts (quiz_id, user_answers, score)
        VALUES (?, ?, ?)
    """, (attempt.quiz_id, ",".join(attempt.user_answers), score))

    attempt_id = cursor.lastrowid
    connection.commit()
    connection.close()
    return {"id": attempt_id, "quiz_id": attempt.quiz_id, "score": score}

@app.get("/quizzes/{quiz_id}/attempts/")
async def get_attempts(quiz_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM attempts WHERE quiz_id = ?", (quiz_id,))
    attempts = cursor.fetchall()
    connection.close()
    return [dict(attempt) for attempt in attempts]
