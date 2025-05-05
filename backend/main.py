import os
import spacy
import pytextrank
import en_core_web_md
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import traceback
from pydantic import BaseModel
from langdetect import detect
import cohere
from dotenv import load_dotenv
load_dotenv()

# Khởi tạo FastAPI app
app = FastAPI()

# CORS cho extension frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load mô hình spaCy và gắn pyTextRank pipeline
nlp = en_core_web_md.load()
nlp.add_pipe("textrank")

# Schema cho dữ liệu đầu vào
class TextRequest(BaseModel):
    text: str

@app.post("/api/summarize/extract")
def textrank_summary(req: TextRequest):
    if len(req.text.split()) < 30:
        raise HTTPException(status_code=400, detail="The text is too short. Please provide a longer text.")

    try:
        lang_code = detect(req.text)
        if lang_code != "en":
            raise HTTPException(status_code=406, detail="Only English text is supported.")

        doc = nlp(req.text)
        total_sentences = len(list(doc.sents))

        # Tự động tính số câu tóm tắt
        if total_sentences <= 5:
            summary_count = 2
        elif total_sentences <= 10:
            summary_count = 3
        else:
            summary_count = max(4, int(total_sentences * 0.3))

        # Giới hạn số câu tối đa
        summary_count = min(summary_count, 6)

        # Lấy câu quan trọng nhất
        top_sentences = [sent.text for sent in doc._.textrank.summary(limit_sentences=summary_count)]

        # Danh sách từ khóa quan trọng cần kiểm tra
        keywords = ["chain reaction", "explosion", "energy", "nuclear"]

        all_sentences = [sent.text for sent in doc.sents]

        # Bổ sung câu chứa từ khóa nếu chưa có
        for kw in keywords:
            if not any(kw in s for s in top_sentences):
                for s in all_sentences:
                    if kw in s and s not in top_sentences:
                        top_sentences.append(s)
                        break

        # Loại bỏ trùng lặp nếu có
        final_summary = []
        seen = set()
        for sentence in top_sentences:
            if sentence not in seen:
                final_summary.append(sentence)
                seen.add(sentence)

        summary_text = " ".join(final_summary)

        return {
            "summary": summary_text,
            "method": "Optimized spaCy + pyTextRank"
        }

    except HTTPException as http_exc:
    # Ném lại HTTPException gốc, không được xử lý thành 500
        raise http_exc

    except Exception as e:
    # Log lỗi chi tiết (optional)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="TextRank Internal Error. Please try again later.")

cohere_client = cohere.ClientV2(api_key=os.getenv("COHERE_API_KEY"))

@app.post("/api/summarize/abstract")
def abstractive_summary(req: TextRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text is empty.")
    try:
        response = cohere_client.summarize(
            text=req.text,
            model="summarize-xlarge",
            length="medium",
            format="paragraph",
            temperature=0.4
        )
        
        return {
            "summary": response.summary,
            "method": "Cohere"
        }
        
    except HTTPException as http_err:
        raise http_err

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error during Cohere summarization.")