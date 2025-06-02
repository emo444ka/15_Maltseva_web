from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from typing import List

app = FastAPI()

# Модель для представления пользователя
class User(BaseModel):
    name: str
    email: str

# Обработчик для получения списка всех пользователей
@app.get("/users", response_model=List[User])
async def get_all_users():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute("SELECT name, email FROM users")
    users = [{"name": row[0], "email": row[1]} for row in c.fetchall()]
    conn.close()
    return users

# Функция для создания и инициализации базы данных
def init_db():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  name TEXT NOT NULL, 
                  email TEXT NOT NULL UNIQUE)''')
    conn.commit()
    conn.close()

# Инициализация базы данных при запуске приложения
init_db()

# Обработчик для создания нового пользователя
@app.post("/users", response_model=User)
async def create_user(user: User):
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (name, email) VALUES (?, ?)",
                 (user.name, user.email))
        conn.commit()
        return user
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Email уже существует")
    finally:
        conn.close()