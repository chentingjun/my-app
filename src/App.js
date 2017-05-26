import React, { Component } from 'react';
import ReactDOM from 'react-dom';
/*import logo from './logo.svg';*/
import './App.css';

const imageDatas = (function(imageArr){
    for(var i=0; i<imageArr.length; i++){
        var image = imageArr[i];
        image.imageURL = require('./images/' + image.fileName);
    }
    return imageArr;
})(require('./data/imageDatas.json'));

const bgimgurl = require('./images/bg.jpg');
const jiantou = <i className="icon-iconfont">&#xe758;</i>;
/*const jiantou = <i className="icon-turn">&#xe6e1;</i>;*/

class ImgFigure extends Component {
    /**
     * imgfigure的点击处理方法
     * @return {[type]} [description]
     */
    handleClick(e){
        if(this.props.arrange.isCenter){
            this.props.reinverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }
    render() {
        var styleObj = {};
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }
        if(this.props.arrange.rotate){
            var fixArr = ['MozTransform','WebkitTransform','msTransform','transform'];
            fixArr.forEach(function(v,k){
                styleObj[v] = "rotateY(" + this.props.arrange.rotate + "deg)";
            }.bind(this));
        }
        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }
        var imgFigureClassName = "img-figure";
        if(this.props.arrange.isInverse){
            imgFigureClassName += " img-inverse";
        }else{
            imgFigureClassName += "";
        }
        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
                <img src={this.props.data.imageURL}
                    alt={this.props.data.title} />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick.bind(this)}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

class App extends Component {
    constructor(){
        super();
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: {//水平方向的取值范围
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: {//垂直方向的取值范围
                top: [0, 0],
                left: [0, 0]
            }
        }
        this.state = this.getInitialState();
    }
    //组件加载后，为每张图片计算其位置的范围
    componentDidMount(e){
        console.log(this.refs);

        //首先拿到舞台的大小
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.floor(stageW / 2),
            halfStageH = Math.floor(stageH / 2);
        //拿到一个figure的大小
        var imgfigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgfigureDOM.scrollWidth,
            imgH = imgfigureDOM.scrollHeight,
            halfImgW = Math.floor(imgW / 2),
            halfImgH = Math.floor(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }
        //计算左、右侧图片范围
        this.Constant.hPosRange = {
            leftSecX: [-halfImgW, halfStageW - halfImgW*3],
            rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
            top: [-halfImgH, stageH - halfImgH]
        }
        //计算中间上侧图片范围
        this.Constant.vPosRange = {
            top: [-halfImgH, halfStageH - halfImgH*3],
            left: [halfStageW - imgW, halfStageW]
        }
        this.arrange(0);
    }
    getInitialState(){
        return {
            imgsArrangeArr: [
                /*{
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,//偏转角度
                    isInverse: false//图片是否翻转
                    isCenter: false//图片是否居中中
                }*/
            ]
        }
    }
    render() {
        var controllerUnits = [],
            imgFigures = [];
        console.log(this.state);
        imageDatas.forEach(function(value, key){
            if(!this.state.imgsArrangeArr[key]){
                this.state.imgsArrangeArr[key] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isCenter: false
                };
            }
            imgFigures.push(<ImgFigure key={key} data={value}
                ref={'imgFigure' + key}
                arrange={this.state.imgsArrangeArr[key]}
                reinverse={this.reInverse(key)}
                center={this.center(key)} />);
            controllerUnits.push(<ControllerUnit key={key}
                arrange={this.state.imgsArrangeArr[key]}
                inverse={this.reInverse(key)}
                center={this.center(key)} />)
        }.bind(this));
        var styleObj = {
            background: "url(" + bgimgurl + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
        }
        return (
            <section className="stage" ref="stage">
                <section style={styleObj} className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
    /**
     * 重新布局中心图片
     * @type {[type]}
     */
    center(centerIndex){
        return function(){
            this.arrange(centerIndex);
        }.bind(this);
    }
    /**
     * 重新布局所有图片
     * @param centerIndex 指定局中哪个图片
     */
    arrange(allindex){
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeTop = hPosRange.top,
            vPosRangeLeft = vPosRange.left,
            vPosRangeTop = vPosRange.top,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),
            //取一个图片或不取
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(allindex, 1);

        //首先居中 cneterindex 的图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isInverse: false,
            isCenter: true
        }
        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(v,k){
            imgsArrangeTopArr[k] = {
                pos: {
                    top: this.getRangeRandom(vPosRangeTop[0], vPosRangeTop[1]),
                    left: this.getRangeRandom(vPosRangeLeft[0], vPosRangeLeft[1])
                },
                rotate: this.get30DegRandom(),
                /*rotate: this.getRangeRandom(-30, 30),*/
                isInverse: false,
                isCenter: false
            };
        }.bind(this));

        //布局两侧的图片
        var ln = 0;
        var rn = 0;
        for(var i=0,j=imgsArrangeArr.length/2; i<imgsArrangeArr.length; i++){
            var flag = true;//往左侧加图片
            var hPosRangeLORX = null;
            //前一半在左边，后一半在右边
            if(ln >= j || rn >= j){
                flag = false;
            }
            if(flag){
                if(Math.random() > 0.5){
                    hPosRangeLORX = hPosRangeLeftSecX;
                    ln++;
                }else{
                    hPosRangeLORX = hPosRangeRightSecX;
                    rn++;
                }
            }else{
                if(ln >= j){
                    hPosRangeLORX = hPosRangeRightSecX;
                    rn++;
                }else{
                    hPosRangeLORX = hPosRangeLeftSecX;
                    ln++;
                }
            }
            imgsArrangeArr[i] = {
                pos: {
                    top: this.getRangeRandom(hPosRangeTop[0], hPosRangeTop[1]),
                    left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                /*rotate: this.get30DegRandom(),*/
                rotate: this.getRangeRandom(-30, 30),
                isInverse: false,
                isCenter: false
            }
        }
        if(imgsArrangeArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
        }
        imgsArrangeArr.splice(allindex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }
    /**
     * 翻转图片
     * @param  {[type]} index [图片的索引]
     * @return {[type]}       [返回触发方法]
     */
    reInverse(index){
        return function(){
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
        }.bind(this);
    }
    /**
     * 获取low和high之间的随机值
     * @param  {[type]} low  [description]
     * @param  {[type]} high [description]
     * @return {[type]}      [description]
     */
    getRangeRandom(low, high){
        return Math.floor(Math.random() * (high - low) + low);
    }
    /**
     * 获取0~30°之间的正负值
     * @return {[type]} [description]
     */
    get30DegRandom(){
        return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30);
    }
}

class ControllerUnit extends Component {
    handleClick(e){
        //如果点击的是当前正在选中的态的图片，则翻转图片，否则将对应的图片居中
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    }
    render(){
        var txthtml = '';
        var controllerClassName = 'controller-unit';
        //如果对应图片是居中的，显示控制按钮的居中态
        if(this.props.arrange.isCenter){
            txthtml = <i className="icon-iconfont">&#xe758;</i>;
            controllerClassName += ' is-center';
            //如果对应图片是翻转的，显示控制按钮的翻转态
            if(this.props.arrange.isInverse){
                controllerClassName += ' is-inverse';
            }
        }
        return (
            <span className={controllerClassName} onClick={this.handleClick.bind(this)}>{txthtml}</span>
        )
    }
}

export default App;
