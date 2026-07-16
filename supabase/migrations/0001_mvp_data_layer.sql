ALTER TABLE settings ADD COLUMN IF NOT EXISTS openrouter_api_key text NOT NULL DEFAULT '';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL;
ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  front text NOT NULL,
  back text NOT NULL,
  ease_factor integer NOT NULL DEFAULT 250,
  interval integer NOT NULL DEFAULT 1,
  repetitions integer NOT NULL DEFAULT 0,
  due_date timestamp NOT NULL DEFAULT now(),
  last_reviewed_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  date timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  title varchar(255) NOT NULL,
  url text NOT NULL,
  type varchar(100) NOT NULL DEFAULT 'Link'
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar(20) NOT NULL,
  content text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);
