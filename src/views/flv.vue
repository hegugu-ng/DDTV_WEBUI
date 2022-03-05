<template>
    <div>
        <video autoplay controls width="100%" height="500" id="videoElement"></video>
    </div>
</template>
<script>
import flvjs from 'flv.js'

export default {
    mounted(){
        this.$nextTick(() =>{
            this.creatVideo()
        })
    },
    methods:{
        creatVideo(){
            if(flvjs.isSupported()){
                var videoElement = document.getElementById('videoElement');
                var flvPlayer = flvjs.createPlayer({
                    type:'flv',
                    url: 'https://lb1.ipv6.ngworks.cn/tmp/22025582_%E7%BE%BD%E5%87%A4_bilibili/2021_12_12_%E5%85%89%E7%8E%AF%E6%97%A0%E9%99%90_10_52_20_4587.flv?cmd=file_steam&Directory=22025582_%E7%BE%BD%E5%87%A4_bilibili&File=2021_12_12_%E5%85%89%E7%8E%AF%E6%97%A0%E9%99%90_10_52_20_4587.flv&time=1641368665&ver=1&sig=A3D7704C43651D032223E0D6F530A32A4C2A988E'
                });
                flvPlayer.attachMediaElement(videoElement);
                flvPlayer.load();
                flvPlayer.play();
            }
        }
    }
}
</script>
