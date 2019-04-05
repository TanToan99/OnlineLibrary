<?php

Auth::routes();
Auth::routes(['verify' => true]);

Route::get('/', 'HomeController@index')->name('home');
Route::get('/home',function(){
	return redirect()->route('home');
});

Route::get('/book/{id}','BookController@showBookDetailByID')->name('book')->where('id', '[0-9]+');
Route::get('/category/{id}','CategoryController@listBooksById')->name('category')->where('id', '[0-9]+');


Route::group(['prefix' => 'account'], function(){
	Route::get('/','UserController@account')->name('account_profile');
	Route::get('/edit','UserController@edit_show')->name('account_edit');
	Route::post('/edit','UserController@update')->name('account_update');
});

Route::get('logout', 'Auth\LoginController@logout', function () {
    return abort(404);
})->name('logout');

Route::group(['prefix' => 'admin', 'middleware' => 'admin'], function(){
	Route::get('/', 'Admin\DashboardController@index')->name('admin-home');

	Route::group(['prefix' => 'users'], function(){
		Route::get('/list', 'Admin\UserController@index')->name('User.List');
		Route::get('/api/search', 'Admin\UserController@apiSearch');
		Route::delete('/deleted', 'Admin\UserController@destroy');
		Route::get('/{id}/show', 'Admin\UserController@show')->name('User.Show');
		Route::get('/{id}/edit', 'Admin\UserController@edit')->name('User.Edit');
		Route::post('/{id}/edit', 'Admin\UserController@update')->name('User.Update');
		Route::get('/search', 'Admin\UserController@search')->name('User.Search');
		Route::get('/create', 'Admin\UserController@create')->name('User.Create');
		Route::post('/create', 'Admin\UserController@store')->name('User.Store');
	});

	Route::group(['prefix' => 'category'], function(){
		Route::get('/list', 'Admin\CategoryController@index')->name('Category.List');
		Route::post('/add', 'Admin\CategoryController@store');
		Route::put('/updated', 'Admin\CategoryController@update');
		Route::delete('/deleted', 'Admin\CategoryController@destroy');
	});

	Route::group(['prefix' => 'books'], function(){
		Route::get('/list', 'Admin\BookController@index')->name('Book.List');
		Route::get('/create', 'Admin\BookController@create')->name('Book.Create');
		Route::post('/create', 'Admin\BookController@store')->name('Book.Store');
		Route::get('/{id}/edit', 'Admin\BookController@edit')->name('Book.Edit');
		Route::post('/{id}/edit', 'Admin\BookController@update')->name('Book.Update');
		Route::get('/search', 'Admin\BookController@search')->name('Book.Search');
		Route::get('/api/search', 'Admin\BookController@apiSearch');
		Route::delete('/deleted', 'Admin\BookController@destroy');
	});

	Route::group(['prefix' => 'order'], function(){
		Route::get('/list/{status}', 'Admin\OrderController@index')->name('Order.List');
		Route::get('/show', 'Admin\OrderController@show')->name('Order.Show');
		Route::get('/create', 'Admin\OrderController@create')->name('Order.Create');
		Route::post('/create', 'Admin\OrderController@store')->name('Order.Store');
		Route::get('/{status}/search', 'Admin\OrderController@search')->name('Order.Search');
		Route::put('/updated', 'Admin\OrderController@update');
		Route::delete('/deleted', 'Admin\OrderController@destroy');
		Route::get('/book/{id}', 'Admin\OrderController@OrderByBook')->name('Order.Book');
		Route::get('/user/{id}', 'Admin\OrderController@OrderByUser')->name('Order.User');
	});

	Route::group(['prefix' => 'comment'], function(){
		Route::get('/list', 'Admin\CommentController@index')->name('Comment.List');
		Route::get('/search', 'Admin\CommentController@search')->name('Comment.Search');
		Route::delete('/deleted', 'Admin\CommentController@destroy');
	});
	
});

