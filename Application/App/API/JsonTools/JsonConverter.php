<?php namespace API\JsonTools;

class JsonConverter
{
    public static function Response(JsonRequestFormat $RequestBody): false|string
    {
        self::setHeaders();
        $Response = [
            'Status' => $RequestBody->Status_Code,
            'Message' => $RequestBody->Status_Message,
            'Data' => $RequestBody->Data
        ];
        return json_encode($Response);
    }

    public static function setHeaders(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=UTF-8');
        header('Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE');
        header('Access-Control-Max-Age: 3600');
        header('Access-Type: application/json; charset=UTF-8');
        header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers');
    }
    public static function Receive(){
       return json_decode(file_get_contents('php://input'), true);
    }

}
