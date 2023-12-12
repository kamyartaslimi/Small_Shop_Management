<?php require 'App/Tools/AutoLoad.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers');

use API\MySQL\Operation\CheckOperation;
use API\MySQL\Operation\ProductOperation;
use API\JsonTools\JsonConverter;
use API\JsonTools\JsonData;
use API\MySQL\Operation\SellProductOperation;
use Models\Product;
use Models\Check;
use Models\SellProduct;
use Tools\ToolsTime;

$Request_Body = JsonConverter::Receive();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    switch ($Request_Body['PostAction']) {
        case 'PostProductToCreate':
            $Product = new Product($Request_Body['Name'], $Request_Body['Price'], $Request_Body['Inventory'], $Request_Body['ProductPosition'], $Request_Body['InventoryAlarm']);
            $ProductOperation = new ProductOperation();
            echo JsonConverter::Response($ProductOperation->Create($Product));
            break;
        case 'GetProductByID':
            $ProductOperation = new ProductOperation();
            echo JsonConverter::Response(($ProductOperation->ReadByID($Request_Body['id'])));
            break;
        case "GetHomeProduct":
            $ProductOperation = new ProductOperation();
            echo JsonConverter::Response($ProductOperation->Read());
            break;
        case "GetHomeProductAlarm":
            $ProductOperation = new ProductOperation();
            echo JsonConverter::Response($ProductOperation->Read(function (array $filter) {
                $ListResult = [];
                foreach ($filter as $value) {
                    if ($value->Inventory <= $value->InventoryAlarm) {
                        $ListResult[] = $value;
                    }
                }
                return $ListResult;
            }));
            break;
        case "SearchingHomePage":
            $ProductOperation = new ProductOperation();
            echo JsonConverter::Response($ProductOperation->Search($Request_Body['SearchBy']));
            break;
        case "CreateCheck":
            $Request_Body['CheckStatus'] = false;
            $Check = new Check(
                $Request_Body['OwnerName'],
                $Request_Body['ReceiverName'],
                $Request_Body['PaymentType'],
                (float)$Request_Body['CheckPrice'],
                ToolsTime::JalaliToGregorian(ToolsTime::DateCreate($Request_Body['CheckDate'])),
                $Request_Body['ReceiverNumber'],
                $Request_Body['CheckDescription'] ?? "",
                $Request_Body['CheckStatus']);
            $CheckOperation = new CheckOperation();
            echo JsonConverter::Response($CheckOperation->Create($Check));
            break;
        case "GetChecks":
            $CheckOperation = new CheckOperation();
            echo JsonConverter::Response($CheckOperation->Read(
                function ($DateArray){
                return array_map(function($Convertor) {
                    $Convertor->RemainTime = ToolsTime::CheckTimeAgo($Convertor->CheckDate) ? $Convertor->RemainTime : 0 ;
                    $Convertor->CheckDate = ToolsTime::GregorianToJalali($Convertor->CheckDate);
                    $Convertor->CheckPrice = rtrim(rtrim(number_format($Convertor->CheckPrice , 10 , '.' , ',') , 0), '.');
                    return $Convertor;},
                    $DateArray);}
            ));
            
            break;
        case "SetDataToCalculate":
            $SellProductOperation = new SellProductOperation();
            $ProductOperation = new ProductOperation();
            $SearchResult = $ProductOperation->ReadByID($Request_Body['id'])->Data;
            $SellData = new SellProduct($Request_Body['id'] , $SearchResult->Name , $SearchResult->Price , $Request_Body['InventorySell']);
            echo JsonConverter::Response($SellProductOperation->CreateInUpdate($SellData));
            break;
        case "GetDataCalculate":
            $SellProductOperation = new SellProductOperation();
            echo JsonConverter::Response($SellProductOperation->Read(
                function ($Data)
                {
                    $FinalPrice = null;
                    foreach ($Data as $value) {
                        $FinalPrice += $value->TotalPrice;
                    }
                    $CalculateClass = new stdClass();
                    $CalculateClass->SellProducts = $Data;
                    $CalculateClass->AlarmNumber = count($Data);
                    $CalculateClass->FinalPrice = $FinalPrice;
                    return $CalculateClass;
                }
            ));
            break;
        case "CheckChangeStatus":
            $CheckOperation = new CheckOperation();
            echo JsonConverter::Response($CheckOperation->Update($Request_Body['id'] , $Request_Body['CheckStatus']
            , function ($ReturnData) {
                    global $Request_Body, $CheckOperation;
                    $ReturnCheckStatus = $CheckOperation->Read(null , $Request_Body['id'])->Data->CheckStatus;
                    $ReturnObj = new stdClass();
                    $ReturnObj->Message = $ReturnData;
                    $ReturnObj->CheckStatus = $ReturnCheckStatus;
                    return $ReturnObj;
                }
            ));
            break;
    }
}elseif($_SERVER['REQUEST_METHOD'] == 'PUT'){
    var_dump($Request_Body);
    $Product = new Product($Request_Body['Name'], $Request_Body['Price'], $Request_Body['Inventory'], $Request_Body['ProductPosition'] , $Request_Body['InventoryAlarm'] , $_GET['id']);
    $ProductOperation = new ProductOperation();
    echo JsonConverter::Response($ProductOperation->Update($Product));
}elseif ($_SERVER['REQUEST_METHOD'] == 'PATCH'){
    if ($Request_Body['PatchAction'] == 'ProductReturn') {
        $ProductOperation = new ProductOperation();
        $ID = $Request_Body['id'];
        $ProductData = $ProductOperation->ReadByID($ID , PDO::FETCH_ASSOC)->JsonToArray()['Data'];
        $Inventory = $ProductData['Inventory'] + $Request_Body['Inventory'];
        if ($Inventory != $ProductData['Inventory']) {
            $Product = new Product($ProductData['Name'], $ProductData['Price'], $Inventory, $ProductData['ProductPosition'], $ProductData['InventoryAlarm'] , $ID);
            echo  JsonConverter::Response(JsonData::CreatRequest(
                ['Inventory' => $ProductOperation->Update($Product , ProductOperation::$Update_Obj)->Data->Inventory, 'Message' => $Request_Body['Inventory']. ' عدد محصول اضافه شد'],
                200 , 'UpdateSuccessfully'));
        }
    } else if ($Request_Body['PatchAction'] == 'ProductSell') {
        $ProductOperation = new ProductOperation();
        $ID = $Request_Body['id'];
        $ProductData = $ProductOperation->ReadByID($ID , PDO::FETCH_ASSOC)->JsonToArray()['Data'];
        $Inventory = $ProductData['Inventory'] - $Request_Body['Inventory'];
        if ($Inventory != $ProductData['Inventory']) {
            $Product = new Product($ProductData['Name'], $ProductData['Price'], $Inventory, $ProductData['ProductPosition'], $ProductData['InventoryAlarm'] , $ID);
            echo JsonConverter::Response(JsonData::CreatRequest(
                ['Inventory' => $ProductOperation->Update($Product , ProductOperation::$Update_Obj)->Data->Inventory, 'Message' => $Request_Body['Inventory']. ' عدد محصول فروخته شد'],
                200 , 'UpdateSuccessfully'));
        }
    }
}elseif($_SERVER['REQUEST_METHOD'] == 'DELETE'){
    switch ($Request_Body['DeleteAction']) {
        case 'DeleteProduct':
            $ProductOperation = new ProductOperation();
            echo JsonConverter::Response($ProductOperation->Delete($Request_Body['id']));
            break;
        case 'DeleteCheck':
            $CheckOperation = new CheckOperation();
            echo JsonConverter::Response($CheckOperation->Delete($Request_Body['id']));
            break;
        case 'DeleteAllSellCalculate':
            $SellProductOperation = new SellProductOperation();
            echo JsonConverter::Response($SellProductOperation->Delete());
            break;
        case 'DeleteCellSellCalculate':
            $SellProductOperation = new SellProductOperation();
            echo JsonConverter::Response($SellProductOperation->Delete($Request_Body['id']));
            break;
    }
}
else {
    echo 'دسترسی به این قسمت محدود شده است';
}
