import os
from datetime import datetime, timezone
from html import escape
from uuid import uuid4

from fastapi import APIRouter

from lib.db import db
from lib.email import EMAIL_REPLY_TO, send_email
from models.partner import PartnerInquiryCreate, PartnerInquiryResponse

router = APIRouter(prefix="/partners", tags=["partners"])
PARTNER_INBOX = os.environ["PARTNER_INBOX"]


@router.post("", response_model=PartnerInquiryResponse, status_code=201)
async def create_partner_inquiry(input_data: PartnerInquiryCreate) -> PartnerInquiryResponse:
    inquiry_id = str(uuid4())
    created_at = datetime.now(timezone.utc)
    document = {
        "id": inquiry_id,
        **input_data.model_dump(mode="json"),
        "created_at": created_at,
    }
    await db.partner_inquiries.insert_one(document)
    safe_name = escape(input_data.full_name)
    safe_org = escape(input_data.organization)
    safe_type = escape(input_data.organization_type)
    safe_email = escape(str(input_data.email))
    safe_volume = escape(str(input_data.monthly_waste_tons))
    safe_message = escape(input_data.message).replace("\n", "<br />")
    email_html = (
        '<table role="presentation" width="100%"><tr><td style="padding:24px;font-family:Arial,sans-serif;color:#24352b">'
        '<h2 style="margin:0 0 16px;color:#143d2b">New AJET partnership inquiry</h2>'
        f'<p><strong>Name:</strong> {safe_name}<br /><strong>Organization:</strong> {safe_org}<br />'
        f'<strong>Type:</strong> {safe_type}<br /><strong>Monthly waste:</strong> {safe_volume} tons<br />'
        f'<strong>Work email:</strong> {safe_email}</p><p><strong>Message</strong><br />{safe_message}</p>'
        f'<p style="font-size:12px;color:#6b7a70">Inquiry ID: {escape(inquiry_id)} · Sent by AJET.</p>'
        '</td></tr></table>'
    )
    await send_email(
        to=PARTNER_INBOX,
        subject="New AJET partnership inquiry",
        html=email_html,
        reply_to=EMAIL_REPLY_TO,
    )
    return PartnerInquiryResponse(
        id=inquiry_id,
        status="received",
        message="Your partnership inquiry is with the AJET team.",
        created_at=created_at,
    )