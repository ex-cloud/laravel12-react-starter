<?php
declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', static function (Blueprint $table): void {
            $table->id();
            $table->foreignId('menu_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('menu_items')->onDelete('cascade');
            $table->string('title');
            $table->string('url')->nullable();
            $table->string('icon')->nullable();
            $table->string('target')->nullable(); // ex: _blank, _self
            $table->integer('order')->default(0);
            $table->json('roles')->nullable(); // ex: ["admin", "editor"]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
