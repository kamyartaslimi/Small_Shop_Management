<?php namespace Models;

use Elastic\Apm\TransactionContextRequestUrlInterface;

class

SellProduct
{
    public function __construct(public int $id , public string $Name, public float $Price, public int $Inventory){}

    public function ListConvertor(): array
    {
        return array('id' => $this->id, 'Name' => $this->Name, 'Price' => $this->Price, 'Inventory' => $this->Inventory);
    }

    public function NullChecker(): array
    {
        $Result = [];
        foreach ($this->ListConvertor() as $Key => $Value){
            if (trim($Value) != null && !is_null(trim($Value))){
                $Result[$Key] = true;
            }
            else{
                $Result[$Key] = false;
            }
        }
        return $Result;
    }

}
