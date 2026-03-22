# 🛠️ Especificação Técnica (spec.md)

## 📖 Visão Geral

Este documento descreve como o sistema **Crypto Sandbox** será estruturado tecnicamente, incluindo o modelo de dados e a organização das entidades principais da aplicação.

---

## 🗂️ Modelo de Dados

O sistema será baseado em entidades que representam usuários, criptomoedas, carteira e transações.

```mermaid
erDiagram

    USUARIO ||--|| CARTEIRA : possui
    CARTEIRA ||--o{ TRANSACAO : registra
    CRIPTOMOEDA ||--o{ TRANSACAO : referencia

    USUARIO {
        string id PK
        string nome
        float saldo
    }

    CARTEIRA {
        string id PK
        string usuarioId FK
    }

    CRIPTOMOEDA {
        string id PK
        string nome
        string simbolo
        float precoAtual
    }

    TRANSACAO {
        string id PK
        string tipo
        float quantidade
        float preco
        string data
        string carteiraId FK
        string criptoId FK
    }
```
