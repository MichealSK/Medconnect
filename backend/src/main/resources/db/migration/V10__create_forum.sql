-- V10__create_forum_tables.sql

CREATE TABLE forum_posts (
                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             author_id UUID NOT NULL REFERENCES users(id),
                             title VARCHAR NOT NULL,
                             content TEXT NOT NULL,
                             category VARCHAR NOT NULL,
                             likes_count INT DEFAULT 0,
                             created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE forum_comments (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
                                author_id UUID NOT NULL REFERENCES users(id),
                                parent_comment_id UUID REFERENCES forum_comments(id),
                                content TEXT NOT NULL,
                                likes_count INT DEFAULT 0,
                                created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE forum_post_likes (
                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
                                  user_id UUID NOT NULL REFERENCES users(id),
                                  UNIQUE(post_id, user_id)
);

CREATE TABLE forum_comment_likes (
                                     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                     comment_id UUID NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
                                     user_id UUID NOT NULL REFERENCES users(id),
                                     UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX idx_forum_comments_parent_id ON forum_comments(parent_comment_id);