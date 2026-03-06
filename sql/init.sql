CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(100) PRIMARY KEY,
    value NUMERIC(12, 2) NOT NULL,
    creation_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    CONSTRAINT fk_order
      FOREIGN KEY(order_id)
      REFERENCES orders(order_id)
      ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_items_order_id ON items(order_id);