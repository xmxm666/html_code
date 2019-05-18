<template>
  <div id="RichText">
    <!-- 图片上传组件辅助-->
    <el-upload
      id="quill-upload"
      style="display: none"
      class="avatar-uploader"
      :action="`${backendBasePath}/pic/uploadSchoolImages`"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      name='file'
      :before-upload="beforeUpload">
    </el-upload>
    <quill-editor v-loading="quillUpdateImg" v-model="content"
                  class="rich-text"
                  ref="myQuillEditor"
                  :options="editorOption">
    </quill-editor>
  </div>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
  import {backendBasePath} from "../project-config/base";
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike', 'clean'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'direction': 'rtl'}],
    ['blockquote', 'code-block'],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}, {'color': []}, {'align': []}, 'link', 'image'],
  ];
  export default {
    name: "RichText",
    props: ["value"],
    components: {quillEditor},
    data() {
      return {
        backendBasePath,
        quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
        editorOption: {
          placeholder: '请在这里编辑自定义内容',
          modules: {
            toolbar:  {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('#quill-upload input').click()
                  } else {
                    this.quill.format('image', false);
                  }}
              }
            },
          },
        }
      }
    },
    methods: {
      // 富文本图片上传前
      beforeUpload() {
        // 显示loading动画
        this.quillUpdateImg = true
      },

      uploadSuccess(res, file) {
        // res为图片服务器返回的数据
        // 获取富文本组件实例
        let quill = this.$refs.myQuillEditor.quill
        // 如果上传成功
        if (res.code === '200') {
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.info为服务器返回的图片地址
          
          quill.insertEmbed(length, 'image', this.getPathByAssetPath(res.url))
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          this.$message.error('图片插入失败')
        }
        // loading动画消失
        this.quillUpdateImg = false
      },

      // 富文本图片上传失败
      uploadError() {
        // loading动画消失
        this.quillUpdateImg = false
        this.$message.error('图片插入失败')
      }
    },
    computed: {
      content: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("input", val)
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  #RichText {
    line-height: 1;
    height: 600px;
    width: 70%;
    min-width: 1000px;
    padding-bottom: 120px;
    .rich-text {
      height: 100%;
    }
  }
</style>
