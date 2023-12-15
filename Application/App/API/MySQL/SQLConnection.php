<?php namespace API\MySQL;

use API\JsonTools\JsonConverter;
use API\JsonTools\JsonData;
use Grpc\Channel;
use mysql_xdevapi\Exception;
use PDO;

class SQLConnection extends PDO
{
    public function __construct()
    {
        try {
            parent::__construct("mysql:host=localhost:3306;dbname=LocStoreManagement", "root", "06585806");
            $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);      
        } catch (Exception $e) {
            JsonConverter::Response(JsonData::CreatRequest('اتصال به دیتابیس با خطا مواجه شد، متن خطا : ' . $e, 404, 'SQLFiledConnection'));die;
        }
    }
}