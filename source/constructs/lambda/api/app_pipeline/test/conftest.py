# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import io
import os
import zipfile

import boto3
import pytest

from collections.abc import Iterable


def _process_lambda(func_str):
    zip_output = io.BytesIO()
    zip_file = zipfile.ZipFile(zip_output, "w", zipfile.ZIP_DEFLATED)
    zip_file.writestr("lambda_function.py", func_str)
    zip_file.close()
    zip_output.seek(0)
    return zip_output.read()


def get_test_zip_file1():
    pfunc = """
            def lambda_handler(event, context):
                print("custom log event")
                return "Ok"
            """
    return _process_lambda(pfunc)


def make_graphql_lambda_event(name, args):
    return {"arguments": args, "info": {"fieldName": name}}


def make_ddb_table(table_name, pk="id", pk_type="S", sk=None, sk_type=None, rows=[]):
    ddb = boto3.resource("dynamodb")
    table = ddb.create_table(
        TableName=table_name,
        KeySchema=[{"AttributeName": pk, "KeyType": "HASH"}]
        + ([{"AttributeName": sk, "KeyType": "RANGE"}] if sk else []),
        AttributeDefinitions=[{"AttributeName": pk, "AttributeType": pk_type}]
        + ([{"AttributeName": sk, "AttributeType": sk_type}] if sk else []),
        ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
    )
    with table.batch_writer() as batch:
        for data in rows:
            batch.put_item(Item=data)


def init_ddb(config):
    """
    config = {
        "ddb_table_name": { "id": 123123, "name": "the-name" }
        "ddb_table_name2": [ { "id": 123123, "name": "the-name" }, { ... } ]
    }
    """
    ddb = boto3.resource("dynamodb")
    for table_name, value in config.items():
        table = ddb.create_table(
            TableName=table_name,
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )

        if isinstance(value, dict):
            table.put_item(Item=value)
        elif isinstance(value, Iterable):
            for v in value:
                table.put_item(Item=v)
        elif value is not None:
            table.put_item(Item=value)
        else:
            pass

    return ddb


def init_table(table, rows):
    with table.batch_writer() as batch:
        for data in rows:
            batch.put_item(Item=data)
            
            
@pytest.fixture(autouse=True)
def default_environment_variables():
    """Mocked AWS evivronment variables such as AWS credentials and region"""
    os.environ["AWS_ACCESS_KEY_ID"] = "mocked-aws-access-key-id"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "mocked-aws-secret-access-key"
    os.environ["AWS_SESSION_TOKEN"] = "mocked-aws-session-token"
    os.environ["AWS_REGION"] = "us-east-1"
    os.environ["AWS_DEFAULT_REGION"] = "us-east-1"

    os.environ["STATE_MACHINE_ARN"] = "mocked-sfn-machine-arn"
    os.environ["SOLUTION_VERSION"] = "v1.0.0"
    os.environ["SSM_LOG_CONFIG_DOCUMENT_NAME"] = "v1.0.0"
    os.environ["CONFIG_FILE_S3_BUCKET_NAME"] = "mocked-s3-bucket-name"
    os.environ["INSTANCE_META_TABLE_NAME"] = "mocked-instance-meta-table-name"
    os.environ["APP_PIPELINE_TABLE_NAME"] = "mocked-app-pipeline-table-name"
    os.environ["SVC_PIPELINE_TABLE_NAME"] = "SVC_PIPELINE_TABLE_NAME"
    os.environ["APPPIPELINE_TABLE"] = "mocked-app-pipeline-table-name"
    os.environ["APP_LOG_CONFIG_TABLE_NAME"] = "mocked-app-log-config-table-name"
    os.environ["LOG_CONFIG_TABLE"] = "mocked-app-log-config-table-name"
    os.environ["INSTANCE_GROUP_TABLE_NAME"] = "mocked-instance-group-table-name"
    os.environ["APPLOGINGESTION_TABLE"] = "mocked-app-log-ingestion-table-name"
    os.environ["EC2_LOG_SOURCE_TABLE_NAME"] = "mocked-ec2-log-source-table-name"
    os.environ["LOG_SOURCE_TABLE_NAME"] = "mocked-log-source-table-name"
    os.environ["S3_LOG_SOURCE_TABLE_NAME"] = "mocked-s3-log-source-table-name"
    os.environ["EKS_CLUSTER_SOURCE_TABLE_NAME"] = "mocked-eks-log-source-table-name"
    os.environ["LOG_SOURCE_TABLE_NAME"] = "mocked-log-source-table-name"
    os.environ["OPENSEARCH_MASTER_ROLE_ARN"] = "OPENSEARCH_MASTER_ROLE_ARN"
    os.environ[
        "LOG_AGENT_EKS_DEPLOYMENT_KIND_TABLE"
    ] = "mocked-log-agent-eks-deployment-kind-table"
    os.environ["GRAFANA_TABLE"] = "mocked-grafana-table-name"
    os.environ["METADATA_TABLE"] = "mocked-metadata-table-name"
    os.environ["ETLLOG_TABLE"] = "mocked-ec2-etl-log-table-name"
    os.environ["CLUSTER_TABLE"] = "mocked-cluster-table-name"
    os.environ["LIGHT_ENGINE_APP_PIPELINE_ID"] = "c5840c23-79c2-4bf5-b35d-025dad5ba254"
    os.environ["ACCOUNT_ID"] = "12345678"
    os.environ["REGION"] = "us-east-1"
    os.environ["PARTITION"] = "aws"
    os.environ["DEFAULT_LOGGING_BUCKET"] = "logging-bucket"
    os.environ["DEFAULT_CMK_ARN"] = f"arn:{os.environ['PARTITION']}:kms:{os.environ['REGION']}:{os.environ['ACCOUNT_ID']}:key/06323b23"
