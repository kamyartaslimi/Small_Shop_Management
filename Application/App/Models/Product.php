<?php namespace Models;

use Elastic\Apm\TransactionContextRequestUrlInterface;

class

Product
{
    public function __construct(public string $Name, public float $Price, public int $Inventory, public string $ProductPosition , public int $InventoryAlarm = 0 , public ?int $id = null){}

    public function ListConvertor(): array
    {
        return [
            'Name' => $this->Name,
            'Price' => $this->Price,
            'Inventory' => $this->Inventory,
            'InventoryAlarm' => $this->InventoryAlarm,
            'ProductPosition' => $this->ProductPosition];
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
