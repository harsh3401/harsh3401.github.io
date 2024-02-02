from flask import Blueprint, jsonify
import os, requests
from flask import Flask,request,jsonify,make_response
from dotenv import load_dotenv
from datetime import date
from dateutil.relativedelta import relativedelta

routes=Blueprint('main_routes',__name__)




#write middleware function for errors

@routes.route('/company-data', methods = ["GET"])
def stock_ticker():
    search_string=request.args.get('ticker')
    search_string=(search_string,False)[search_string is None]
    if search_string:
        stock_data=requests.get("{}/stock/profile2?symbol={}&token={}".format(os.environ.get("FINHUB_ENDPOINT"),search_string,os.environ.get("FINHUB_API_KEY")))
        if stock_data.status_code == 200:
            stock_data=stock_data.json()
            if not stock_data:
                stock_data=make_response(jsonify({"Error":"Ticker not found"}),404)
        else :
            stock_data=make_response(jsonify({"Error":"Finhub API Error"}),502)
    else:
        stock_data= make_response(jsonify({"Error":"No Search String Provided"}),400)
    return stock_data

@routes.route('/stock-summary', methods = ["GET"])
def stock_summary():
    ticker=request.args.get('ticker')
    ticker=(ticker,False)[ticker is None]
    if ticker:
        stock_data=requests.get("{}/quote?symbol={}&token={}".format(os.environ.get("FINHUB_ENDPOINT"),ticker,os.environ.get("FINHUB_API_KEY")))
        
        if stock_data.status_code == 200:
            stock_data=stock_data.json()
            if not stock_data["d"]:
                stock_data=make_response(jsonify({"Error":"Stock not found"}),404)
        else :
            stock_data=make_response(jsonify({"Error":"Finhub API Error"}),502)
    else:
        stock_data= make_response(jsonify({"Error":"No Search String Provided"}),400)
    return stock_data


@routes.route('/recommendation-trends', methods = ["GET"])
def recommendation_trends():
    ticker=request.args.get('ticker')
    ticker=(ticker,False)[ticker is None]
    if ticker:
        stock_data=requests.get("{}/stock/recommendation?symbol={}&token={}".format(os.environ.get("FINHUB_ENDPOINT"),ticker,os.environ.get("FINHUB_API_KEY")))
        
        if stock_data.status_code == 200:
            stock_data=stock_data.json()
            if not stock_data:
                stock_data=make_response(jsonify({"Error":"Stock not found"}),404)
            else:
                stock_data=stock_data[0]
        else :
            stock_data=make_response(jsonify({"Error":"Finhub API Error"}),502)
    else:
        stock_data= make_response(jsonify({"Error":"No Search String Provided"}),400)
    return stock_data




@routes.route('/company-news', methods = ["GET"])
def company_news():
    ticker=request.args.get('ticker')
    ticker=(ticker,False)[ticker is None]
    TODAY=date.today()
    PREVIOUS_MONTH=TODAY+relativedelta(months=-1)
    if ticker:
        stock_data=requests.get("{}/company-news?symbol={}&from={}&to={}&token={}".format(os.environ.get("FINHUB_ENDPOINT"),ticker,PREVIOUS_MONTH,TODAY,os.environ.get("FINHUB_API_KEY")))
        
        if stock_data.status_code == 200:
            stock_data=stock_data.json()
            if not stock_data:
                stock_data=make_response(jsonify({"Error":"Stock not found"}),404)
            else:
                stock_data=stock_data[:4]
        else :
            stock_data=make_response(jsonify({"Error":"Finhub API Error"}),502)
    else:
        stock_data= make_response(jsonify({"Error":"No Search String Provided"}),400)
    return stock_data


@routes.route('/chart-data', methods = ["GET"])
def chart_data():
    ticker=request.args.get('ticker')
    ticker=(ticker,False)[ticker is None]
    TODAY=date.today()
    PREVIOUS_MONTH=TODAY+relativedelta(months=-6,days=-1)
    if ticker:
        stock_data=requests.get("{}/{}/range/1/day/{}/{}?adjusted=true&sort=asc&apiKey={}".format(os.environ.get("POLYGON_ENDPOINT"),ticker,PREVIOUS_MONTH,TODAY,os.environ.get("POLYGON_API_KEY")))

        if stock_data.status_code == 200:
            stock_data=stock_data.json()
            if not stock_data:
                stock_data=make_response(jsonify({"Error":"Stock not found"}),404)
            else:
                stock_data=stock_data["results"]
        else :
            stock_data=make_response(jsonify({"Error":"Polygon API Error"}),502)
    else:
        stock_data= make_response(jsonify({"Error":"No Search String Provided"}),400)
    return stock_data

