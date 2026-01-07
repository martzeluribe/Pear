<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;
use Exception;

class OdooService{

    protected $url;
    protected $db;
    protected $username;
    protected $password;


    public function __construct(){
        $this->url = rtrim(env("ODOO_URL"),'/').'/jsonrpc';
        $this->db = env("ODOO_DB");
        $this->username = env("ODOO_USERNAME");
        $this->password = env("ODOO_PASSWORD");
    }
    public function create (String $model, array $data){
        //autentifikazioa
        $uid = $this->rpc('common','login',[
            $this->db, $this->username, $this->password
        ]);
        if(!$uid){
            throw new \Exception('Odoo: Credenciales incorrectas o DB no encontrado');
        }
        return $this->rpc('object','execute_kw', [
          $this->db, $uid, $this->password, $model, 'create', [$data]
        ]);

    }
    public function search (String $model, array $zutabe){
        //autentifikazioa
        $uid = $this->rpc('common','login',[
            $this->db, $this->username, $this->password
        ]);
        if(!$uid){
            throw new \Exception('Odoo: Credenciales incorrectas o DB no encontrado');
        }
        return $this->rpc('object','execute_kw', [
          $this->db, $uid, $this->password, $model, 'search_read', [[], $zutabe]
        ]);

    }
    public function write (String $model, array $data){
        //autentifikazioa
        $uid = $this->rpc('common','login',[
            $this->db, $this->username, $this->password
        ]);
        if(!$uid){
            throw new \Exception('Odoo: Credenciales incorrectas o DB no encontrado');
        }
        return $this->rpc('object','execute_kw', [
          $this->db, $uid, $this->password, $model, 'write', $data
        ]);
    }


    protected function rpc($service, $method, $args){       //args = classaren argmentuak  + ????????????'
        $response =  Http::post($this->url, [
            'jsonrpc' => '2.0',
            'method' => 'call',
            'params' => [
                'service' => $service,  //'common' edo 'object'
                'method' => $method,    //'login', 'execute_kw'
                'args' => $args,
            ],
            'id' => rand(1, 999999), //egokiagoa time erabiltzea, rand errepikatu egin ahal daitekeelako
        ])->json();

        if(isset($response['error'])){
            throw new \Exception('Odoo Error: '. json_encode($response['error']));
        }

        return $response['result'];


    }

}