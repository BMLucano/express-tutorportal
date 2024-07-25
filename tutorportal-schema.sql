CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    role VARCHAR(10) NOT NULL
        CHECK (role IN('tutor', 'student'))
);

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NUll DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assignments_students (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NUll
        REFERENCES assignments ON DELETE CASCADE,
    student_username VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'assigned'
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL
        REFERENCES assignments ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    student_username VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE,
    assignment_id INTEGER NOT NULL
        REFERENCES assignments ON DELETE CASCADE,
    question_id INTEGER NOT NULL
        REFERENCES questions,
    answer TEXT DEFAULT 'not answered',
    feedback TEXT,
    submitted_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_submission_answer UNIQUE (student_username, assignment_id, question_id, answer)
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    student_username VARCHAR(25) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTERVAL NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    student_username VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_path TEXT,  -- store the file path instead of binary data
    session_id INTEGER REFERENCES sessions (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    student_username VARCHAR(25) NOT NULL
        REFERENCES users (username) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_username VARCHAR(25) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
    receiver_username VARCHAR(25) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);