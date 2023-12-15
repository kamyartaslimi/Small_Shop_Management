<?php namespace API\MySQL\Operation;

use API\JsonTools\JsonConverter;
use API\JsonTools\JsonRequestFormat;
use API\MySQL\SQLConnection;
use Models\Product;
use API\JsonTools\JsonData;
use mysql_xdevapi\Exception;
use PDO;
class ProductOperation
{
    public static int $Update_Message = 1;
    public static int $Update_Obj = 2;


    private SQLConnection $DBConnection;

    public function __construct()
    {
        try {
            $this->DBConnection = new SQLConnection();
        } catch (Exception $e) {
            JsonConverter::Response(JsonData::CreatRequest('اتصال به دیتابیس با خطا مواجه شد، متن خطا : ' . $e, 404, 'SQLFiledConnection'));die;
        }
    }

    public function Create(Product|null $Data): JsonRequestFormat
    {
        if ($Data != null) {
            if (!in_array(false, $Data->NullChecker())) {
                $SqlConnection = $this->DBConnection;
                $SQLData = $SqlConnection->prepare(/** @lang text */ "SELECT * FROM `Products` where `Name` = :Name");
                $SQLData->bindParam(":Name", $Data->Name);
                $SQLData->execute();
                if ($SQLData->rowCount() == 0) {
                    $ResultQuery = $this->DBConnection->prepare(/** @lang text */ "insert into Products (`Name` , `Price` , `Inventory` , `InventoryAlarm` , `ProductPosition`) VALUE (:Name , :Price , :Inventory , :InventoryAlarm , :ProductPosition)");
                    $DataList = $Data->ListConvertor();
                    $ResultQuery->execute($DataList);
                    if ($ResultQuery->rowCount() == 1) {
                        return (JsonData::CreatRequest('افزودن کالا با موفقیت انجام شد', 201, 'CreateSuccessfully'));
                    }
                } else {
                    return (JsonData::CreatRequest('این محصول از قبل وجود دارد', 400, 'NameAlreadyExist'));
                }
            }
        }
        return (JsonData::CreatRequest('فیلد های ضروری را پر کنید', 400, 'error'));
    }
    public function Read(callable $filter = null): false|string|JsonRequestFormat
    {
        try {

            if ($filter === null) {
                $filter = function ($Data) {
                    return $Data;
                };
            }
            $ResultQuery = $this->DBConnection->prepare(/** @lang text */ "Select id , Name , Price , Inventory , InventoryAlarm , ProductPosition from products");
            $ResultQuery->execute();
            $ProductList = $ResultQuery->fetchAll(PDO::FETCH_OBJ);
            if (!(count($ProductList) <= 0)) {
                return JsonData::CreatRequest($filter($ProductList), 200, 'SendOK');
            }
            return (JsonData::CreatRequest('دیتایی درون دیتابیس یافت نشد', 203, 'IsNull'));
        } catch (Exception $e) {
            return (JsonData::CreatRequest("در ارتباط با دیتا بیس خطایی رخ داد . متن خطا : " . $e, 400, 'error'));
        }
    }
    public function ReadByID(int $ID , int $ReturnType = PDO::FETCH_OBJ): JsonRequestFormat
    {
        try {

            $ResultQuery = $this->DBConnection->prepare(/** @lang text */ "Select id , Name , Price , Inventory , InventoryAlarm , ProductPosition from products WHERE id = :id");
            $ResultQuery->bindParam(':id' , $ID , PDO::PARAM_INT);
            $ResultQuery->execute();
            $ProductObject = $ResultQuery->fetch($ReturnType);
            if (!is_null($ProductObject)) {
                return (JsonData::CreatRequest($ProductObject, 200, 'SendOK'));
            }
            return (JsonData::CreatRequest('همچین دیتایی با این ایدی درون دیتابیس یافت نشد', 203, 'IsNull'));
        } catch (Exception $e) {
            return (JsonData::CreatRequest("در ارتباط با دیتا بیس خطایی رخ داد . متن خطا : " . $e, 400, 'error'));
        }
    }
    public function Search(string $Text , callable $filter = null): false|string|JsonRequestFormat
    {
        try {
            if ($filter === null) {
                $filter = function ($Data) {
                    return $Data;
                };
            }
            $ResultQuery = $this->DBConnection->prepare(/** @lang text */ "SELECT id, Name, Price, Inventory, InventoryAlarm, ProductPosition FROM products WHERE Name LIKE CONCAT('%', :Text, '%')");
            $ResultQuery->bindParam(':Text' , $Text , PDO::PARAM_STR);
            $ResultQuery->execute();
            $ProductList = $ResultQuery->fetchAll(PDO::FETCH_OBJ);
            if (!(count($ProductList) <= 0)) {
                return JsonData::CreatRequest($filter($ProductList), 200, 'SendOK');
            }
            else{
                return $this->Read();
            }
        } catch (Exception $e) {
            return (JsonData::CreatRequest("در ارتباط با دیتا بیس خطایی رخ داد . متن خطا : " . $e, 400, 'error'));
        }
    }

    /**
     * @param Product $Data
     * @param int $ReturnType = ProductOperation::Update_Message
     * default ProductOperation::Update_Message
     * @return JsonRequestFormat
     */
    public function Update(Product $Data , int $ReturnType = 1): JsonRequestFormat
    {
        try {

            if (!in_array(false, $Data->NullChecker())) {
                $ResultQuery = $this->DBConnection->prepare(/** @lang text */ "UPDATE Products SET `Name` = :Name , `Price` = :Price  , `Inventory` = :Inventory, `InventoryAlarm` = :InventoryAlarm , `ProductPosition`= :ProductPosition WHERE id = :id");
                $DataList = $Data->ListConvertor() + ['id' => $Data->id];
                $ResultQuery->execute($DataList);
                if ($ResultQuery->rowCount() == 1) {
                    if ($ReturnType == self::$Update_Message) {
                        return (JsonData::CreatRequest('ویرایش کالا با موفقیت انجام شد', 200, 'UpdateSuccessfully'));
                    }elseif ($ReturnType == self::$Update_Obj) {
                        return (JsonData::CreatRequest($this->ReadByID($Data->id)->Data, 200, 'UpdateSuccessfully'));
                    }
                }
            }
            return (JsonData::CreatRequest('فیلد های ضروری را پر کنید', 400, 'error'));
        } catch (Exception $e) {
            return (JsonData::CreatRequest('ارتباط با دیتابیس با خطا مواجه شد ، متن خطا : ' . $e, 404, 'error'));
        }
    }
    public function Delete(int $Data): JsonRequestFormat
    {
        if ($Data != null) {
            $ResultQuery = $this->DBConnection->prepare( /** @lang text */ "Delete from Products WHERE id = :id");
            $ResultQuery->execute(['id' => $Data]);
            if ($ResultQuery->rowCount() == 1) {
                return (JsonData::CreatRequest('حدف کالا با موفقیت انجام شد', 202, 'DeleteSuccessfully'));
            }
        }
        return  (JsonData::CreatRequest('فیلد های ضروری را پر کنید', 400, 'error'));
    }

}