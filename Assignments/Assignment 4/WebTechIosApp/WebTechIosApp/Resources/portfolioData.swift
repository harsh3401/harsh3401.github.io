//
//  portfolioData.swift
//  WebTechIosApp
//
//  Created by Harsh Jain on 09/04/24.
//

import Foundation
import SwiftUI

struct PortfolioItem:Hashable,Codable,Identifiable{
    
    var id:Int
    var tickerName:String
    var qty:Int
    var price:Double
    var change:Double
    var changePercent:Double
}
