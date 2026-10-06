"""
Criterion: Email safety guard still rejects unsafe HTML.

This exercises the pure validator function lib.email._assert_safe_email directly
(it has no HTTP surface - it's an internal guard called before any outbound email
send), per the acceptance matrix instruction to "Import backend lib.email and call
_assert_safe_email".
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest

from lib.email import _assert_safe_email


def test_rejects_form_tags():
    with pytest.raises(ValueError):
        _assert_safe_email("Subject", "<html><body><form><input/></form></body></html>")


def test_rejects_non_https_link():
    with pytest.raises(ValueError):
        _assert_safe_email("Subject", '<html><body><a href="http://example.com">link</a></body></html>')


def test_rejects_credential_ask_phrase():
    with pytest.raises(ValueError):
        _assert_safe_email("Subject", "<html><body>Please reply with your password now</body></html>")


def test_rejects_mismatched_anchor_text_host():
    with pytest.raises(ValueError):
        _assert_safe_email(
            "Subject",
            '<html><body><a href="https://evil.example.com/phish">bank.com</a></body></html>',
        )


def test_passes_for_safe_html():
    # should not raise
    _assert_safe_email(
        "Subject",
        '<html><body>Hello, visit <a href="https://ajet.example.com/docs">our site</a>.</body></html>',
    )
