<?php namespace Models;
use Cassandra\Date;
use DateTime;

class Check
{
    public function __construct(
        public string $OwnerName,
        public string $ReceiverName,
        public string $PaymentType,
        public float $CheckPrice,
        public string $CheckDate,
        public string $ReceiverNumber,
        public string $CheckDescription,
        public bool $CheckStatus)
    {}

    public function ListConvertor(): array
    {
        return [
            'OwnerName' => $this->OwnerName,
            'ReceiverName' => $this->ReceiverName,
            'PaymentType' => $this->PaymentType,
            'CheckPrice' => $this->CheckPrice,
            'CheckDate' => $this->CheckDate,
            'ReceiverNumber' => $this->ReceiverNumber,
            'CheckDescription' => $this->CheckDescription,
            'CheckStatus' => $this->CheckStatus
        ];
    }

    public function NullChecker(): array
    {
        $Result = [];
        foreach ($this->ListConvertor() as $Key => $value) {
            if (trim($value) != null && !is_null(trim($value)) || $value === false || $value === true) {
                $Result[$Key] = true;
            } else {
                $Result[$Key] = false;
            }
        }
        return $Result;
    }
}