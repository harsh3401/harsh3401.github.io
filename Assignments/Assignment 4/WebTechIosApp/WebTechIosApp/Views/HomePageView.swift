//
//  HomePageView.swift
//  WebTechIosApp
//
//  Created by Harsh Jain on 09/04/24.
//

import SwiftUI


struct HomePageView: View {
    @State private var loadingStockData:Bool = false
    @State private var searchText = ""
    let names = ["AAPL", "NVDA", "TSLA", "AAP"]

    

    var searchResults: [String] {
            if searchText.isEmpty {
                return names
            } else {
                return names.filter { $0.contains(searchText) }
            }
        }
    
    var body: some View {
        NavigationView {
            VStack{
                if loadingStockData
                {
                    ProgressView("Fetching Data..")
                }
                else if(searchText != ""){
                    List{
                        ForEach(searchResults, id: \.self) { result in
                            NavigationLink{  PortfolioDetail()} label:{
                                HStack{
                                    VStack(alignment:.leading){
                                        Text(result).font(.title2).bold()
                                        Text("5 shares").foregroundColor(.secondary)
                                    }
                                    Spacer()
                                    
                                }
                            }
                        }
                    }.frame(maxHeight: .infinity,alignment: .top).border(/*@START_MENU_TOKEN@*/Color.black/*@END_MENU_TOKEN@*/)
                                }
                else{
                    VStack{
                        HStack{
                            Text(getFormattedDate()).font(.title).foregroundStyle(.secondary).bold().padding([.bottom,.top,.leading],10)
                            Spacer()}.background(.white).cornerRadius(10)
                        
                        PortfolioListView()
                        FavouritesListView()
                        HStack{
                            Spacer()
                            Link(destination: URL(string: "https://finnhub.io")!) {
                                Text("Powered by Finnhub.io")
                                     }
                           .foregroundStyle(.secondary).bold().padding([.bottom,.top],10)
                            Spacer()}.background(.white).cornerRadius(10)
                    }.padding()
                }
         
               
            }.navigationTitle("Stocks").toolbar {
                if !loadingStockData
                {
                    EditButton()
                }
                
            }.background(Color(.systemGroupedBackground))
        }.searchable(text: $searchText){

                List{
                    ForEach(searchResults, id: \.self) { result in
                        NavigationLink{  StockDetailView()} label:{
                            HStack{
                                VStack(alignment:.leading){
                                    Text(result).font(.title2).bold()
                                    Text("AAPLE INC").foregroundColor(.secondary)
                                }
                                Spacer()
                                
                            }
                        }
                    }
                }
        }
        // add the conditional styling for search control
        
    }
}




//GPT
func getFormattedDate() -> String {
    let dateFormatter = DateFormatter()
    dateFormatter.dateStyle = .medium
    dateFormatter.timeStyle = .none
    dateFormatter.dateFormat = "MMMM d, yyyy"
    return dateFormatter.string(from: Date())
}
#Preview {
    HomePageView()
}
