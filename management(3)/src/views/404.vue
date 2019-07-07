<template>
    <p class="page-container">404 page not found</p>
</template>

<style lang="scss">
    .paddingM input{
		padding: 0 3px;
	}
	input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
	input[type="number"] {
		-moz-appearance: textfield;
	}
    .foot {
        text-align: center;
        padding-top: 60px
    }
    .headIcon {
        width: 60px;
        height: 60px;
        border-radius: 50%
    }
	.ql-snow .ql-picker-label::before{
        position: relative;
        top: -10px;
    }
	.ql-snow .ql-color-picker .ql-picker-label svg, .ql-snow .ql-icon-picker .ql-picker-label svg {
		position: relative;
        top: -7px;
	}
    .ql-editor p {
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
        font-size: 14px
    }
    .line div {
        display: inline-block
    }
    .maxH {
        max-height: 50px;
        display: -webkit-box;
		-webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden
    }
    .maxH * {
        margin: 4px 0;
        font-size: 14px!important
    }
    .fr {
        float: right
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        text-align: center
    }
    .avatar {
        display: block
    }
    .head-icon .el-upload {
        border-radius: 50%;
        overflow: hidden
    }
    .head-icon .avatar-uploader-icon {
        width: 90px;
        height: 90px;
        line-height: 90px
    }

    .head-icon .avatar {
        width: 90px;
        height: 90px
    }

    .photo .avatar-uploader-icon {
        width: 180px;
        height: 100px;
        line-height: 100px
    }

    .photo .avatar {
        width: 180px;
        height: 100px
    }
    .page-container {
        font-size: 20px;
        text-align: center;
        color: rgb(192, 204, 218);
    }
</style>