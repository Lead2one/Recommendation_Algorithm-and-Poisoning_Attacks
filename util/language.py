# 初始化 AKs&SKs
import os
from flask_socketio import emit
import time
os.environ["IFLYTEK_SPARK_APP_ID"] = "d70b6799"
os.environ["IFLYTEK_SPARK_API_KEY"] = "104f0f3351ff0041c41fc2c1b586d56e"
os.environ["IFLYTEK_SPARK_API_SECRET"] = "YzIwMjMwMzM3MDYyZjQ0YjEzNzFlOWI1"
os.environ["IFLYTEK_SPARK_API_URL"] = "wss://spark-api.xf-yun.com/v4.0/chat"
os.environ["IFLYTEK_SPARK_llm_DOMAIN"] = "4.0Ultra"
os.environ["SERPAPI_API_KEY"] = "e1629960e761804031676af7479d2f3ec594bcf32da3cddd71952aa41d04673c"
os.environ["ZHIPUAI_API_KEY"] = "f51b7baeb14b18b9b8b67d5e094f60bb.9p8M96Yx98uh8GWj"
from langchain_community.chat_models import ChatSparkLLM
spark_chat_model = ChatSparkLLM()
from langchain_community.chat_models import ChatZhipuAI
zhipuai_chat_model = ChatZhipuAI(model="glm-4")
chat_model = spark_chat_model

from langchain.schema import (
    AIMessage,
    SystemMessage,
    HumanMessage
)
def getAIanalysis(data):
    
    message="请对下面的数据进行分析："
    system_human_msgs = [
        SystemMessage("你是一个擅长数据分析的数据分析师。善于分析推荐算法的投毒攻击，比较评估投毒前后的数值，并给出自己的看法。注意只用说出评估的内容，而不用介绍自己。"),
        HumanMessage(message + "投毒前：Hit Ratio: 0.45224 Precision: 0.05934 Recall: 0.51910 NDCG: 0.28214 投毒后： Hit Ratio: 0.44365 Precision: 0.05822 Recall: 0.51560 NDCG: 0.28264")
    ]
    response = chat_model.invoke(input=system_human_msgs)
    message = response.content
    # print(response.content)
    # # print(response.type)
    # print(type(response.content))
    # print("end...")
    # 逐字符发送消息，同时处理换行符
    flag=False  # 刚刚发送了一个'\n'
    for char in message:
        if char == '*':
            continue
        if char == '\n':
            if flag==True:
                flag=False
                continue
            emit('botmessage', '<br>')  # 发送换行标签
            flag=True
        else:
            emit('botmessage', char)
        time.sleep(0.05)  # 休眠0.1秒，模拟打字效果