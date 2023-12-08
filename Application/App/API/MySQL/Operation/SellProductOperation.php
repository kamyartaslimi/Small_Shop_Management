<?php namespace API\MySQL\Operation;

use API\JsonTools\JsonRequestFormat;
use API\MySQL\SQLConnection;
use API\JsonTools\JsonData;
use Models\SellProduct;
use mysql_xdevapi\Exception;
use PDO;

class SellProductOperation
{

    private SQLConnection $DBConnection;

    public function __construct()
    {
        $this->DBConnection = new SQLConnection();
    }

    public function CreateInUpdate(SellProduct $Data): JsonRequestFormat
    {
        try {
            $ResultQuery = $this->DBConnection->prepare(/** @lang text */
                "Select * from SellProducts WHERE id = :id");
            $ResultQuery->bindParam('id' , $Data->id , PDO::PARAM_INT);
            $ResultQuery->execute();
            $QueryReturn = $ResultQuery->fetch(PDO::FETCH_OBJ) ?? null;
            if ($ResultQuery->rowCount() == 0)
                if (!in_array(false, $Data->NullChecker())) {
                    $ResultQuery = $this->DBConnection->prepare(/** @lang text */
                        "insert into SellProducts (`id` , `Name` , `Price` , `Inventory` ) VALUE (:id , :Name , :Price , :Inventory)");
                    $DataList = $Data->ListConvertor();
                    $ResultQuery->execute($DataList);
                    if ($ResultQuery->rowCount() == 1) {
                        return (JsonData::CreatRequest('دیتا با موفقیت در ماشین حساب قرار گرفت', 201, 'CreateSuccessfully'));
                    }
                    if ($ResultQuery->rowCount() > 1) {
                        return (JsonData::CreatRequest('دیتا ها در هنگام اپدیت با خطای هم شناسه برخورد کردند لطفا آن را به پشتیبانی گزارش کنید', 201, 'CreateSuccessfully'));
                    } else {
                        return (JsonData::CreatRequest('در هنگام دیتا داده خطایی رخ داد', 400, 'CreateSuccessfully'));
                    }
                } else {
                    return (JsonData::CreatRequest('فیلد های ضروری را پر کنید', 400, 'error'));
                }
            else{
                if (!in_array(false, $Data->NullChecker())) {
                    $ResultQuery = $this->DBConnection->prepare(/** @lang text */ "Update SellProducts SET `Inventory` = :Inventory WHERE id = :id");
                    $FinalInventory = $QueryReturn->Inventory + $Data->Inventory;
                    $ResultQuery->bindParam(':Inventory' , $FinalInventory);
                    $ResultQuery->bindParam(':id' , $Data->id);
                    $ResultQuery->execute();
                    if ($ResultQuery->rowCount() == 1) {
                        return (JsonData::CreatRequest('دیتا با موفقیت در ماشین حساب قرار گرفت', 201, 'CreateSuccessfully'));
                    }
                    if ($ResultQuery->rowCount() > 1) {
                        return (JsonData::CreatRequest('دیتا ها در هنگام اپدیت با خطای هم شناسه برخورد کردند لطفا آن را به پشتیبانی گزارش کنید', 201, 'CreateSuccessfully'));
                    } else {
                        return (JsonData::CreatRequest('در هنگام دیتا داده خطایی رخ داد', 400, 'CreateSuccessfully'));
                    }
                } else {
                    return (JsonData::CreatRequest('فیلد های ضروری را پر کنید', 400, 'error'));
                }
            }
        } catch (Exception $e) {
            return (JsonData::CreatRequest("در هنگام ثبت داده خطایی رخ داد . متن خطا : " . $e, 400, 'error'));
        }
    }

    public function Read(callable $filter = null): false|string|JsonRequestFormat
    {
        try {
            if ($filter === null) {
                $filter = function ($Data) {
                    return $Data;
                };
            }

            $ResultQuery = $this->DBConnection->prepare("SELECT  `id` , `Name` , `Price` , `Inventory` , `Price` * `Inventory` as TotalPrice FROM SellProducts");
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
    public function Delete(?int $ID = null): JsonRequestFormat
    {
        if ($ID != null) {
            $ResultQuery = $this->DBConnection->prepare( /** @lang text */ "Delete from SellProducts WHERE id = :id");
            $ResultQuery->execute(['id' => $ID]);
            if ($ResultQuery->rowCount() == 1) {
                return (JsonData::CreatRequest('حدف  دیتا با موفقیت انجام شد', 202, 'DeleteSuccessfully'));
            }
        }
        else{
            $ResultQuery = $this->DBConnection->prepare( /** @lang text */ "Delete from SellProducts");
            $ResultQuery->execute();
            if ($ResultQuery->rowCount() > 0) {
                return (JsonData::CreatRequest('حدف  دیتا با موفقیت انجام شد', 202, 'DeleteSuccessfully'));
            }
        }
        return (JsonData::CreatRequest('حدف  دیتا با خطا مواجه شد', 400, 'DeleteError'));
    }

}