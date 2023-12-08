<?php namespace API\MySQL\Operation;

use API\JsonTools\JsonRequestFormat;
use API\MySQL\SQLConnection;
use Models\Check;
use API\JsonTools\JsonData;
use mysql_xdevapi\Exception;
use PDO;

class CheckOperation
{
//    public static int $Update_Message = 1;
//    public static int $Update_Obj = 2;

    private SQLConnection $DBConnection;

    public function __construct()
    {
        $this->DBConnection = new SQLConnection();
    }

    public function Create(Check $Data): JsonRequestFormat
    {
        try {
            if ($Data->CheckDate) {
                if (!in_array(false, $Data->NullChecker())) {
                    $ResultQuery = $this->DBConnection->prepare(/** @lang text */
                        "insert into Checks (`OwnerName` , `ReceiverName` , `PaymentType` , `CheckPrice` , `CheckDate` , `ReceiverNumber` , `CheckDescription` , `CheckStatus`) 
                VALUE (:OwnerName , :ReceiverName , :PaymentType , :CheckPrice , :CheckDate , :ReceiverNumber , :CheckDescription , :CheckStatus)");
                    $DataList = $Data->ListConvertor();
                    $ResultQuery->execute($DataList);
                    if ($ResultQuery->rowCount() == 1) {
                        return (JsonData::CreatRequest('افزودن کالا با موفقیت انجام شد', 201, 'CreateSuccessfully'));
                    }
                    if ($ResultQuery->rowCount() > 1) {
                        return (JsonData::CreatRequest('کالاها در هنگام اپدیت با خطای هم شناسه برخورد کردند لطفا آن را به پشتیبانی گزارش کنید', 201, 'CreateSuccessfully'));
                    }
                    else {
                        return (JsonData::CreatRequest('در هنگام ثبت داده خطایی رخ داد', 400, 'CreateSuccessfully'));
                    }
                }else{
                    return (JsonData::CreatRequest('فیلد های ضروری را پر کنید', 400, 'error'));
                }
            }else{
                return (JsonData::CreatRequest('نوع ورودی تاریخ صحیح نمی باشد', 400, 'error'));
            }
        }catch (Exception $e)
        {
            return (JsonData::CreatRequest("در هنگام ثبت داده خطایی رخ داد . متن خطا : " . $e, 400, 'error'));
        }
    }

    public function Read(callable $filter = null ,int $WhereByID = null): false|string|JsonRequestFormat
    {
        try {
            if ($filter === null) {
                $filter = function ($Data) {
                    return $Data;
                };
            }
            $Products = null;
            if ($WhereByID != null)
            {
                $ResultQuery = $this->DBConnection->prepare(/** @lang text */ "SELECT  id , OwnerName , ReceiverName , PaymentType , CheckPrice , CheckDate , ReceiverNumber , CheckDescription , CheckStatus , CheckDate - CURRENT_DATE() AS RemainTime FROM Checks WHERE id = :id");
                $ResultQuery->bindParam(':id' , $WhereByID , PDO::PARAM_INT);
                $ResultQuery->execute();
                $Products = $ResultQuery->fetch(PDO::FETCH_OBJ);
            }
            else {
                $ResultQuery = $this->DBConnection->prepare(/** @lang text */ "SELECT  id , OwnerName , ReceiverName , PaymentType , CheckPrice , CheckDate , ReceiverNumber , CheckDescription , CheckStatus , CheckDate - CURRENT_DATE() AS RemainTime FROM Checks ORDER BY CheckDate");
                $ResultQuery->execute();
                $Products = $ResultQuery->fetchAll(PDO::FETCH_OBJ);
            }
            if ($WhereByID == null) {
                if (!(count($Products) <= 0)) {
                    return JsonData::CreatRequest($filter($Products), 200, 'SendOK');
                }
            }
            else{
                if (!is_null($Products))
                {
                    return JsonData::CreatRequest($filter($Products), 200, 'SendOK');
                }
            }
            return (JsonData::CreatRequest('دیتایی درون دیتابیس یافت نشد', 203, 'IsNull'));
        } catch (Exception $e) {
            return (JsonData::CreatRequest("در ارتباط با دیتا بیس خطایی رخ داد . متن خطا : " . $e, 400, 'error'));
        }
    }
    public function Update(int $ID, int|bool $CheckOperation , callable $filter = null): JsonRequestFormat
    {
        try {
            $ResultQuery = $this->DBConnection->prepare(/** @lang text */ "UPDATE Checks SET `CheckStatus` = :CheckStatus WHERE id = :id");
            $ResultQuery->bindParam(':id', $ID);
            if ($CheckOperation == 0) {
                $CheckStatus = true;
            } else {
                $CheckStatus = false;
            }
            $ResultQuery->bindParam(':CheckStatus', $CheckStatus, PDO::PARAM_BOOL);
            $ResultQuery->execute();
            if ($ResultQuery->rowCount() == 1) {
                return (JsonData::CreatRequest($filter('ویرایش کالا با موفقیت انجام شد'), 200, 'UpdateSuccessfully'));
            }
            return (JsonData::CreatRequest('عملیات آپدیت با خطا مواجه شد', 400, 'error'));
        } catch (Exception $e) {
            return (JsonData::CreatRequest(' ارتباط با دیتابیس با خطا مواجه شد، متن خطا :' . $e, 404, 'error'));
        }
    }
    public function Delete(int $Data): JsonRequestFormat
    {
        if ($Data != null) {
            $ResultQuery = $this->DBConnection->prepare( /** @lang text */ "Delete from Checks WHERE id = :id");
            $ResultQuery->execute(['id' => $Data]);
            if ($ResultQuery->rowCount() == 1) {
                return (JsonData::CreatRequest('حدف چک با موفقیت انجام شد', 202, 'DeleteSuccessfully'));
            }
        }
        return  (JsonData::CreatRequest('فیلد های ضروری را پر کنید', 400, 'error'));
    }

}