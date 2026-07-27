import os
from dotenv import load_dotenv

load_dotenv()

# ============ SECURITY ============
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ============ DATABASE ============
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crypto_copilot.db")

# ============ THIRD-PARTY APIS (used from Stage 2 onward) ============
COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY", "")
ETHERSCAN_API_URL = "https://api.etherscan.io/api"

# ============ CORS ============
raw_origins = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
FRONTEND_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in raw_origins.split(",")
    if origin.strip()
]
if "http://localhost:5173" not in FRONTEND_ORIGINS:
    FRONTEND_ORIGINS.append("http://localhost:5173")