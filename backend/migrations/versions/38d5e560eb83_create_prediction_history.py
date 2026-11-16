
"""create prediction history

Revision ID: 38d5e560eb83
Revises:
Create Date: 2026-11-16 09:26:06.778113
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "38d5e560eb83"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "prediction_history",
        sa.Column(
            "id",
            sa.BigInteger(),
            sa.Identity(always=True),
            primary_key=True,
        ),
        sa.Column(
            "patient_data",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
        ),
        sa.Column("prediction", sa.String(length=10), nullable=False),
        sa.Column("cad_probability", sa.Float(), nullable=False),
        sa.Column("normal_probability", sa.Float(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.CheckConstraint(
            "prediction IN ('CAD', 'Normal')",
            name="prediction_history_prediction_check",
        ),
        sa.CheckConstraint(
            "cad_probability BETWEEN 0 AND 1",
            name="prediction_history_cad_probability_check",
        ),
        sa.CheckConstraint(
            "normal_probability BETWEEN 0 AND 1",
            name="prediction_history_normal_probability_check",
        ),
    )

    op.create_index(
        "ix_prediction_history_created_at_id",
        "prediction_history",
        ["created_at", "id"],
    )

    op.create_index(
        "ix_prediction_history_prediction_created_at",
        "prediction_history",
        ["prediction", "created_at"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_prediction_history_prediction_created_at",
        table_name="prediction_history",
    )

    op.drop_index(
        "ix_prediction_history_created_at_id",
        table_name="prediction_history",
    )

    op.drop_table("prediction_history")
