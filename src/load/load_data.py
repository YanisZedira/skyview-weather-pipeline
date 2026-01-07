from google.cloud import bigquery
from utils.logger import get_logger

logger = get_logger("LOAD")

def load_to_bigquery(rows, project_id, dataset_id, table_id):
    try:
        valid_rows = [row for row in rows if row is not None]

        if not valid_rows:
            logger.warning("No valid rows to load")
            return

        client = bigquery.Client()
        table_ref = f"{project_id}.{dataset_id}.{table_id}"
        client.insert_rows_json(table_ref, valid_rows)

        logger.info(f"{len(valid_rows)} rows loaded into BigQuery")

    except Exception as e:
        logger.error(f"Load failed - {e}")
