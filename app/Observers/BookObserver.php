<?php

namespace App\Observers;
use App\Book;
use App\Newsletter;
use App\Mail\MailNewsletter;

class BookObserver
{
    public function created(Book $Book)
    {
    	$emails = Newsletter::pluck('email')->toArray();
    	$data = [
    		'id' => $Book->id,
    		'name' => $Book->name,
    		'img' => $Book->img
    	];
        //\Mail::to($emails)->send( new MailNewsletter($data));
    }
}
