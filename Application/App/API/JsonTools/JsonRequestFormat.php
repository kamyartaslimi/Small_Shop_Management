<?php

namespace API\JsonTools;

interface JsonRequestFormat
{
    public static function CreatRequest($Data, $Status_Code, $Status_Message);
}