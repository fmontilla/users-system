-- Script de configuração inicial do banco de dados PostgreSQL
-- Execute este script como superusuário do PostgreSQL

-- Criar banco de dados
CREATE DATABASE userdb;

-- Criar usuário
CREATE USER "user" WITH PASSWORD 'password';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE userdb TO "user";

-- Conectar ao banco userdb e configurar permissões
\c userdb;

-- Conceder privilégios no schema public
GRANT ALL ON SCHEMA public TO "user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "user";

-- Configurar privilégios padrão para futuras tabelas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "user";

-- Criar tabela users
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Criar índice único para email
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Criar enum para roles
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- Alterar coluna role para usar o enum
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";

-- Verificar conexão
SELECT 'Banco de dados configurado com sucesso!' as status; 