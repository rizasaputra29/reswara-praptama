-- CreateTable
CREATE TABLE "PageContent" (
    "id" SERIAL NOT NULL,
    "pageName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_pageName_key" ON "PageContent"("pageName");
