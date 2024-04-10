//
//  PortfolioListView.swift
//  WebTechIosApp
//
//  Created by Harsh Jain on 09/04/24.
//

import SwiftUI



struct FavouritesListView: View {
    func delete(at offsets: IndexSet) {
          print("deleted")
       }
func dmove(){
  
}
    @State private var cashBalance: Int = 25000
    @State private var netWorth: Int = 23000
    var portfolioList:[PortfolioItem]=[
        PortfolioItem(id: 1, tickerName:"AAPL", qty:3, price:500, change: 0, changePercent: 0.04),
        PortfolioItem(id: 2, tickerName:"NVDA", qty:10, price:100, change: -0.02, changePercent: -0.04)
    ]
    var body: some View {
    
            List{
                Section {
         
                ForEach(portfolioList){portfolioItem in
                    NavigationLink{
                  PortfolioDetail()
                    } label: {
                        HStack{
                            VStack(alignment:.leading){
                                Text(portfolioItem.tickerName).font(.title2).bold()
                                Text("\(portfolioItem.qty) shares").foregroundColor(.secondary)
                            }
                            Spacer()
                            VStack(alignment:.trailing){
                                Text("$\(String(format: "%.2f",portfolioItem.price))").bold()
                                HStack
                                {   if(portfolioItem.change>0){
                                    
                                    Image(systemName: "arrow.up.right")
                                }
                                    else if(portfolioItem.change<0)
                                    {
                                        Image(systemName: "arrow.down.right")
                                    }
                                    else
                                    {
                                        Image(systemName: "minus")
                                    }
                                    
                                    Text("$\(String(format: "%.2f",portfolioItem.change))")
                                    Text("(\(String(format: "%.2f",portfolioItem.changePercent))%)")
                                }.foregroundColor(portfolioItem.change>0 ? .green : portfolioItem.change<0 ?.red:.secondary)
                            }
                        }
                    }
                }.onDelete(perform: delete).onMove { from, to in
                    
                    // TODO: move the data source.
                }
                
                } header: {
                  Text("Favourites")
                }
                
            }.padding(0).contentMargins(0)
    }
        
    
}

#Preview {
    FavouritesListView()
}


