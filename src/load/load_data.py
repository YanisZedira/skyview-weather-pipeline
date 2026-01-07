from google.cloud import bigquery

def load_to_bigquery(rows, project_id, dataset_id, table_id):
    client = bigquery.Client()
    table_ref = f"{project_id}.{dataset_id}.{table_id}"
    client.insert_rows_json(table_ref, rows)
