<?php

declare(strict_types=1);

use App\Enums\GenderEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', static function (Blueprint $table): void {
            $table->id();
            $table->uuid('user_id');
            $table->date('birthdate')->nullable();
            $table->string('gender')->nullable()->default(GenderEnum::MALE->value);
            $table->string('marital_status')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
