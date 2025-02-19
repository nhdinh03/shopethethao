-- Product Sizes foreign keys
EXEC sp_rename 'FK__Product_S__produ__06CD04F7', 'FK_ProductSizes_Product'
EXEC sp_rename 'FK__Product_S__size___07C12930', 'FK_ProductSizes_Size'
EXEC sp_rename 'FK4isa0j51hpdn7cx04m831jic4', 'FK_ProductSizes_Product_New'
EXEC sp_rename 'FK3bqabm2nc8yyl9to7fo2trak4', 'FK_ProductSizes_Size_New'

-- Comments foreign keys
EXEC sp_rename 'FK__Comments__user_i__0C85DE4D', 'FK_Comments_User'
EXEC sp_rename 'FK__Comments__produc__0D7A0286', 'FK_Comments_Product'
EXEC sp_rename 'FKfr5v216y8pl7bourpw9y7c7o5', 'FK_Comments_User_New'
EXEC sp_rename 'FK6uv0qku8gsu6x1r2jkrtqwjtn', 'FK_Comments_Product_New'

-- Verification foreign key
EXEC sp_rename 'FK_Verification_Account', 'FK_Verification_User'
EXEC sp_rename 'FK__Verificat__accou__5FB337D6', 'FK_Verification_User_New'

-- Invoices foreign keys
EXEC sp_rename 'FK__Invoices__user_i__18EBB532', 'FK_Invoices_User'
EXEC sp_rename 'FK__Invoices__cancel__19DFD96B', 'FK_Invoices_CancelReason'
EXEC sp_rename 'fk_invoice_user', 'FK_Invoices_User_New'
EXEC sp_rename 'fk_invoice_cancel_reason', 'FK_Invoices_CancelReason_New'

-- Detailed Invoices foreign keys
EXEC sp_rename 'FK__Detailed___invoi__1F98B2C1', 'FK_DetailedInvoices_Invoice'
EXEC sp_rename 'FK__Detailed___produ__208CD6FA', 'FK_DetailedInvoices_Product'
EXEC sp_rename 'FK__Detailed___size___2180FB33', 'FK_DetailedInvoices_Size'
EXEC sp_rename 'fk_detailed_invoice_invoice', 'FK_DetailedInvoices_Invoice_New'
EXEC sp_rename 'fk_detailed_invoice_product', 'FK_DetailedInvoices_Product_New'
EXEC sp_rename 'FK_DetailedInvoices_Sizes', 'FK_DetailedInvoices_Size_New'

-- Product Attribute Mappings foreign keys
EXEC sp_rename 'FK__Product_A__produ__2739D489', 'FK_ProductAttributes_Product'
EXEC sp_rename 'FK__Product_A__attri__282DF8C2', 'FK_ProductAttributes_Attribute'
EXEC sp_rename 'FKkbkcn2uglh8ec88ryh4ip2yao', 'FK_ProductAttributes_Product_New'
EXEC sp_rename 'FKrkmtkqqxh8jy7uysip0w5rf11', 'FK_ProductAttributes_Attribute_New'

-- User Histories foreign keys
EXEC sp_rename 'FK__User_Hist__user___2BFE89A6', 'FK_UserHistories_User'
EXEC sp_rename 'FK2ox4job4mnp26gnasty934ogf', 'FK_UserHistories_User_New'

-- Stock Receipts foreign keys
EXEC sp_rename 'FK_Stock_Receipts_Supplier', 'FK_StockReceipts_Supplier'
EXEC sp_rename 'FK417xwcewegqft6tb9ubudq29e', 'FK_StockReceipts_Supplier_New'
EXEC sp_rename 'FK__Stock_Rec__suppl__71D1E811', 'FK_StockReceipts_Supplier_Old'
EXEC sp_rename 'FK__Stock_Rec__brand__72C60C4A', 'FK_StockReceipts_Brand'

-- Accounts Roles foreign keys
EXEC sp_rename 'FKt44duw96d6v8xrapfo4ff2up6', 'FK_AccountsRoles_Account'
EXEC sp_rename 'FKpwest19ib22ux5gk54esw9qve', 'FK_AccountsRoles_Role'
EXEC sp_rename 'FK__Accounts___accou__59FA5E80', 'FK_AccountsRoles_Account_Old'
EXEC sp_rename 'FK__Accounts___role___5AEE82B9', 'FK_AccountsRoles_Role_Old'

-- Product Images foreign keys
EXEC sp_rename 'FKqnq71xsohugpqwf3c9gxmsuy', 'FK_ProductImages_Product'
EXEC sp_rename 'FK__Product_I__produ__7D439ABD', 'FK_ProductImages_Product_Old'

-- Products foreign keys
EXEC sp_rename 'FKog2rp4qthbtt2lfyhfo32lsw9', 'FK_Products_Category'
EXEC sp_rename 'FK__Products__catego__68487DD7', 'FK_Products_Category_Old'

-- Lock Reasons foreign key
EXEC sp_rename 'FK__lock_reas__accou__5441852A', 'FK_LockReasons_Account'

-- Refresh Token foreign key
EXEC sp_rename 'FKo69c4999op2j0opjop1wflkkr', 'FK_RefreshToken_Account'

-- Receipt Products foreign keys
EXEC sp_rename 'FK__Receipt_P__recei__671F4F74', 'FK_ReceiptProducts_Receipt'
EXEC sp_rename 'FK__Receipt_P__produ__681373AD', 'FK_ReceiptProducts_Product'
EXEC sp_rename 'FKjhrymyvn7igm8cvuxjp32k03p', 'FK_ReceiptProducts_Receipt_New'
EXEC sp_rename 'FKp8scjr0bvgen61gl04fiklkv9', 'FK_ReceiptProducts_Product_New'
