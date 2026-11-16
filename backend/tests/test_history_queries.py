
from datetime import date

import pytest
from fastapi import HTTPException
from sqlalchemy.dialects import postgresql

from app.api.history import get_prediction_history


class RecordingDB:
    def __init__(self):
        self.count_statement = None
        self.records_statement = None

    def scalar(self, statement):
        self.count_statement = statement
        return 0

    def scalars(self, statement):
        self.records_statement = statement

        class EmptyResult:
            def all(self):
                return []

        return EmptyResult()


def test_history_builds_filtered_paginated_query():
    db = RecordingDB()

    result = get_prediction_history(
        page=2,
        limit=1,
        prediction="CAD",
        prediction_id=1,
        date_from=date(2026, 11, 14),
        date_to=date(2026, 11, 15),
        db=db,
    )

    assert result["total"] == 0
    assert result["page"] == 2
    assert result["limit"] == 1
    assert result["records"] == []

    query = db.records_statement.compile(
        dialect=postgresql.dialect()
    )

    sql = str(query).lower()

    assert "prediction" in sql
    assert "created_at" in sql
    assert "limit" in sql
    assert "offset" in sql

    assert query.params["prediction_1"] == "CAD"
    assert query.params["id_1"] == 1
    assert query.params["param_1"] == 1
    assert query.params["param_2"] == 1


def test_history_rejects_invalid_date_range():
    db = RecordingDB()

    with pytest.raises(HTTPException) as exc_info:
        get_prediction_history(
            page=1,
            limit=5,
            prediction=None,
            prediction_id=None,
            date_from=date(2026, 11, 15),
            date_to=date(2026, 11, 14),
            db=db,
        )

    assert exc_info.value.status_code == 400
    assert (
        exc_info.value.detail
        == "Start date cannot be after end date."
    )


def test_history_builds_correct_pagination_query():
    db = RecordingDB()

    result = get_prediction_history(
        page=3,
        limit=2,
        prediction=None,
        prediction_id=None,
        date_from=None,
        date_to=None,
        db=db,
    )

    assert result["page"] == 3
    assert result["limit"] == 2
    assert result["records"] == []

    query = db.records_statement.compile(
        dialect=postgresql.dialect()
    )

    sql = str(query).lower()

    assert "limit" in sql
    assert "offset" in sql

    # Page 3 with limit 2 means offset 4.
    assert 2 in query.params.values()
    assert 4 in query.params.values()
