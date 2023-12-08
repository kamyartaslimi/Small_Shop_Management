<?php
spl_autoload_register(function($Class){
    $Prefix = '';
    $base_dir = str_replace('Tools' , '' ,__DIR__ );
    $len = strlen($Prefix);
    if (strncmp($Prefix , $Class , $len) !== 0){
        return;
    }
    $Relative_Class = substr($Class,$len);
    $file_address = (($base_dir.$Relative_Class).'.php');
    $file = str_replace('\\' , '/' , $file_address);
    if (file_exists($file)){
        require $file;
    }
});