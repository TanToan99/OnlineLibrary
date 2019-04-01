<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
	protected $table = "comment";

	protected $fillable = [
		'comment', 'user_id', 'book_id'
	];

	public function user(){
		return $this->belongsTo('App\User', 'user_id', 'id');
	}
}
