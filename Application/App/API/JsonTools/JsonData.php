<?php

namespace API\JsonTools;

class JsonData implements JsonRequestFormat
{
    public function __construct(public mixed $Data,public mixed $Status_Code,public mixed $Status_Message){}
    public static function CreatRequest($Data, $Status_Code, $Status_Message): JsonData
    {
        return new self($Data, $Status_Code , $Status_Message);
    }
    public function JsonToArray(): array
    {
        return ((array)['Status' => $this->Status_Code, 'Message' => $this->Status_Message, 'Data' => $this->Data]);
    }
}