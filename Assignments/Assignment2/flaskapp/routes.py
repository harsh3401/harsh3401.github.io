from flask import Blueprint, jsonify
import os, requests
from flask import Flask,request,jsonify,make_response
from dotenv import load_dotenv
from datetime import date
from dateutil.relativedelta import relativedelta

routes=Blueprint('main_routes',__name__)



def error_middleware(stock_data,valid_attribute=None):
    if stock_data.status_code == 200:
        stock_data=stock_data.json()
        validation_exp=stock_data if valid_attribute ==  None else stock_data[valid_attribute]
        if not validation_exp:
            stock_data=make_response(jsonify({"Error":"Stock not found"}),404)
    else :
        stock_data=make_response(jsonify({"Error":"External API Error"}),502)
        
    return stock_data

def validation_middleware(ticker,URL,valid_attribute=None):
    stock_ticker=(ticker,False)[ticker is None]
    if stock_ticker:
        return error_middleware(requests.get(URL),valid_attribute)
    else:
        stock_data= make_response(jsonify({"Error":"No Search String Provided"}),400)
    return stock_data

def news_format_validator(news_object):
    validator_keys=["image","url" ,"headline","datetime"]
    for key in validator_keys:
        if news_object[key] is None or news_object[key] == "":
            return False
    return True  
    
    

@routes.route('/company-data', methods = ["GET"])
def stock_ticker():
    search_string=request.args.get('ticker')
    URL="{}/stock/profile2?symbol={}&token={}".format(os.environ.get("FINHUB_ENDPOINT"),search_string,os.environ.get("FINHUB_API_KEY"))
    stock_data=validation_middleware(search_string,URL)
    return stock_data
    

@routes.route('/stock-summary', methods = ["GET"])
def stock_summary():
    ticker=request.args.get('ticker')
    URL="{}/quote?symbol={}&token={}".format(os.environ.get("FINHUB_ENDPOINT"),ticker,os.environ.get("FINHUB_API_KEY"))
    validation_attribute="d"
    stock_data=validation_middleware(ticker,URL,validation_attribute)
    return stock_data


@routes.route('/recommendation-trends', methods = ["GET"])
def recommendation_trends():
    ticker=request.args.get('ticker')
    URL="{}/stock/recommendation?symbol={}&token={}".format(os.environ.get("FINHUB_ENDPOINT"),ticker,os.environ.get("FINHUB_API_KEY"))
    stock_data=validation_middleware(ticker,URL)
    if isinstance(stock_data,list) and len(stock_data)>=1:
        stock_data=stock_data[0]
    return stock_data



@routes.route('/company-news', methods = ["GET"])
def company_news():
    ticker=request.args.get('ticker')
    ticker=(ticker,False)[ticker is None]
    TODAY=date.today()
    PREVIOUS_MONTH=TODAY+relativedelta(months=-1)
    URL="{}/company-news?symbol={}&from={}&to={}&token={}".format(os.environ.get("FINHUB_ENDPOINT"),ticker,PREVIOUS_MONTH,TODAY,os.environ.get("FINHUB_API_KEY"))
    stock_data=validation_middleware(ticker,URL)
    valid_news_data=[]
    if isinstance(stock_data,list) and len(stock_data)>=1:
        for stock_object in stock_data:
            if news_format_validator(stock_object):
                valid_news_data.append(stock_object)
            if len(valid_news_data)==5:
                break    
        return valid_news_data
    else:
        return stock_data
    


@routes.route('/chart-data', methods = ["GET"])
def chart_data():
    ticker=request.args.get('ticker')
    TODAY=date.today()
    PREVIOUS_MONTH=TODAY+relativedelta(months=-6,days=-1)
    URL="{}/{}/range/1/day/{}/{}?adjusted=true&sort=asc&apiKey={}".format(os.environ.get("POLYGON_ENDPOINT"),ticker,PREVIOUS_MONTH,TODAY,os.environ.get("POLYGON_API_KEY"))
    stock_data=validation_middleware(ticker,URL)
    if isinstance(stock_data["results"],list) and len(stock_data)>=1:
        stock_data=stock_data["results"]
    return stock_data

