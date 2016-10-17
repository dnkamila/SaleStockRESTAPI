# SaleStockRESTAPI

For detail API design : doc/api-design.txt
For detail DB design : doc/db-design.txt

Running
1. import salestock_plain.sql
2. configure db in .env
3. npm run start
4. npm run test

Flow
Based on general online shopping with cart system (ex: salestock)
Every customer has cart, once customer create order based on that cart, the cart become empty

Missing
[] endpoint API for submit payment proof (PUT /order/submitPaymentProof)
    in the planning, proof is saved as url
[] testing for Order API