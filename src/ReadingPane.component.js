import React from "react";
import './ReadingPane.css';
import PropTypes from 'prop-types';

class ReadingPane extends React.Component {

  static propTypes = {
    selectVerse: PropTypes.func.isRequired
  }

  state = {
    selectedVerse: null,
    selectedVerseTarget: null
  }

  // add listeners to verse elements
  componentDidMount = () => {
    const verses = document.getElementsByClassName("verse");
    for (let verse of verses) {
      verse.addEventListener("click", this.handleSelectVerseEvent);
    }
  }

  // handle verse selected event
  handleSelectVerseEvent = (event) => {
    let target = event.currentTarget;
    let selectedVerse = event.currentTarget.dataset.usfm;
    if (target.classList.contains("verse")) {
      this.props.selectVerse(selectedVerse);

      // clear previous selection
      if (this.state.selectedVerseTarget !== null)
        this.state.selectedVerseTarget.classList.remove("selected");
      
      // set current selection
      target.classList.add("selected");
      this.setState({
        selectedVerse: selectedVerse,
        selectedVerseTarget: target
      });
    }
  }

  render() {
    return (
      <div className="reading-pane">
        <div className="chapter ch2">
          <div className="title">腓立比书 2</div>
          <div className="s">
            <span className="heading">以基督的心为心</span>
          </div>
          <div className="p">
            <span className="content"> </span>
            <span className="verse v1" data-usfm="PHP.2.1">
              <span className="label">1</span>
              <span className="content">
                所以，在基督里若有什么劝勉，爱心有什么安慰，
              </span>
              <span className="add">
                <span className="content">圣</span>
              </span>
              <span className="content">灵有什么交通，</span>
              <span className="add">
                <span className="content">心中</span>
              </span>
              <span className="content">有什么慈悲怜悯， </span>
            </span>
            <span className="verse v2" data-usfm="PHP.2.2">
              <span className="label">2</span>
              <span className="content">
                你们就要意念相同，爱心相同，有一样的心思，有一样的意念，使我的喜乐可以满足。{" "}
              </span>
            </span>
            <span className="verse v3" data-usfm="PHP.2.3">
              <span className="label">3</span>
              <span className="content">
                凡事不可结党，不可贪图虚浮的荣耀；只要存心谦卑，各人看别人比自己强。{" "}
              </span>
            </span>
            <span className="verse v4" data-usfm="PHP.2.4">
              <span className="label">4</span>
              <span className="content">
                各人不要单顾自己的事，也要顾别人的事。
              </span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v4" data-usfm="PHP.2.4">
              <span className="content"> </span>
            </span>
            <span className="verse v5" data-usfm="PHP.2.5">
              <span className="label">5</span>
              <span className="content">你们当以基督耶稣的心为心：</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v5" data-usfm="PHP.2.5">
              <span className="content"> </span>
            </span>
            <span className="verse v6" data-usfm="PHP.2.6">
              <span className="label">6</span>
              <span className="content">他本有　神的形象，</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v6" data-usfm="PHP.2.6">
              <span className="content">不以自己与　神同等为强夺的；</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v6" data-usfm="PHP.2.6">
              <span className="content"> </span>
            </span>
            <span className="verse v7" data-usfm="PHP.2.7">
              <span className="label">7</span>
              <span className="content">反倒虚己，</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v7" data-usfm="PHP.2.7">
              <span className="content">取了奴仆的形象，</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v7" data-usfm="PHP.2.7">
              <span className="content">成为人的样式；</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v7" data-usfm="PHP.2.7">
              <span className="content"> </span>
            </span>
            <span className="verse v8" data-usfm="PHP.2.8">
              <span className="label">8</span>
              <span className="content">既有人的样子，就自己卑微，</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v8" data-usfm="PHP.2.8">
              <span className="content">存心顺服，以至于死，</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v8" data-usfm="PHP.2.8">
              <span className="content">且死在十字架上。</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v8" data-usfm="PHP.2.8">
              <span className="content"> </span>
            </span>
            <span className="verse v9" data-usfm="PHP.2.9">
              <span className="label">9</span>
              <span className="content">所以，　神将他升为至高，</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v9" data-usfm="PHP.2.9">
              <span className="content">又赐给他那超乎万名之上的名，</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v9" data-usfm="PHP.2.9">
              <span className="content"> </span>
            </span>
            <span className="verse v10" data-usfm="PHP.2.10">
              <span className="label">10</span>
              <span className="content">
                叫一切在天上的、地上的，和地底下的，
              </span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v10" data-usfm="PHP.2.10">
              <span className="content">因耶稣的名无不屈膝，</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v10" data-usfm="PHP.2.10">
              <span className="content"> </span>
            </span>
            <span className="verse v11" data-usfm="PHP.2.11">
              <span className="label">11</span>
              <span className="content">无不口称「耶稣基督为主」，</span>
            </span>
          </div>
          <div className="q1">
            <span className="verse v11" data-usfm="PHP.2.11">
              <span className="content">使荣耀归与父　神。</span>
            </span>
          </div>
          <div className="s">
            <span className="heading">在这世上像明光照耀</span>
          </div>
          <div className="p">
            <span className="verse v11" data-usfm="PHP.2.11">
              <span className="content"> </span>
            </span>
            <span className="verse v12" data-usfm="PHP.2.12">
              <span className="label">12</span>
              <span className="content">这样看来，我亲爱的</span>
              <span className="add">
                <span className="content">弟兄</span>
              </span>
              <span className="content">
                ，你们既是常顺服的，不但我在你们那里，就是我如今不在你们那里，更是顺服的，就当恐惧战兢做成你们得救的工夫。{" "}
              </span>
            </span>
            <span className="verse v13" data-usfm="PHP.2.13">
              <span className="label">13</span>
              <span className="content">
                因为你们立志行事都是　神在你们心里运行，为要成就他的美意。{" "}
              </span>
            </span>
            <span className="verse v14" data-usfm="PHP.2.14">
              <span className="label">14</span>
              <span className="content">凡所行的，都不要发怨言，起争论， </span>
            </span>
            <span className="verse v15" data-usfm="PHP.2.15">
              <span className="label">15</span>
              <span className="content">
                使你们无可指摘，诚实无伪，在这弯曲悖谬的世代作　神无瑕疵的儿女。你们显在这世代中，好像明光照耀，{" "}
              </span>
            </span>
            <span className="verse v16" data-usfm="PHP.2.16">
              <span className="label">16</span>
              <span className="content">
                将生命的道表明出来，叫我在基督的日子好夸我没有空跑，也没有徒劳。{" "}
              </span>
            </span>
            <span className="verse v17" data-usfm="PHP.2.17">
              <span className="label">17</span>
              <span className="content">
                我以你们的信心为供献的祭物，我若被浇奠在其上，也是喜乐，并且与你们众人一同喜乐。{" "}
              </span>
            </span>
            <span className="verse v18" data-usfm="PHP.2.18">
              <span className="label">18</span>
              <span className="content">
                你们也要照样喜乐，并且与我一同喜乐。
              </span>
            </span>
          </div>
          <div className="s">
            <span className="heading">提摩太和以巴弗提</span>
          </div>
          <div className="p">
            <span className="verse v18" data-usfm="PHP.2.18">
              <span className="content"> </span>
            </span>
            <span className="verse v19" data-usfm="PHP.2.19">
              <span className="label">19</span>
              <span className="content">我靠主耶稣指望快打发</span>
              <span className="pn">
                <span className="content">提摩太</span>
              </span>
              <span className="content">
                去见你们，叫我知道你们的事，心里就得着安慰。{" "}
              </span>
            </span>
            <span className="verse v20" data-usfm="PHP.2.20">
              <span className="label">20</span>
              <span className="content">
                因为我没有别人与我同心，实在挂念你们的事。{" "}
              </span>
            </span>
            <span className="verse v21" data-usfm="PHP.2.21">
              <span className="label">21</span>
              <span className="content">
                别人都求自己的事，并不求耶稣基督的事。{" "}
              </span>
            </span>
            <span className="verse v22" data-usfm="PHP.2.22">
              <span className="label">22</span>
              <span className="content">但你们知道</span>
              <span className="pn">
                <span className="content">提摩太</span>
              </span>
              <span className="content">
                的明证；他兴旺福音，与我同劳，待我像儿子待父亲一样。{" "}
              </span>
            </span>
            <span className="verse v23" data-usfm="PHP.2.23">
              <span className="label">23</span>
              <span className="content">
                所以，我一看出我的事要怎样了结，就盼望立刻打发他去；{" "}
              </span>
            </span>
            <span className="verse v24" data-usfm="PHP.2.24">
              <span className="label">24</span>
              <span className="content">但我靠着主自信我也必快去。</span>
            </span>
          </div>
          <div className="p">
            <span className="verse v24" data-usfm="PHP.2.24">
              <span className="content"> </span>
            </span>
            <span className="verse v25" data-usfm="PHP.2.25">
              <span className="label">25</span>
              <span className="content">然而，我想必须打发</span>
              <span className="pn">
                <span className="content">以巴弗提</span>
              </span>
              <span className="content">
                到你们那里去。他是我的兄弟，与我一同做工，一同当兵，是你们所差遣的，也是供给我需用的。{" "}
              </span>
            </span>
            <span className="verse v26" data-usfm="PHP.2.26">
              <span className="label">26</span>
              <span className="content">
                他很想念你们众人，并且极其难过，因为你们听见他病了。{" "}
              </span>
            </span>
            <span className="verse v27" data-usfm="PHP.2.27">
              <span className="label">27</span>
              <span className="content">
                他实在是病了，几乎要死；然而　神怜恤他，不但怜恤他，也怜恤我，免得我忧上加忧。{" "}
              </span>
            </span>
            <span className="verse v28" data-usfm="PHP.2.28">
              <span className="label">28</span>
              <span className="content">
                所以我越发急速打发他去，叫你们再见他，就可以喜乐，我也可以少些忧愁。{" "}
              </span>
            </span>
            <span className="verse v29" data-usfm="PHP.2.29">
              <span className="label">29</span>
              <span className="content">
                故此，你们要在主里欢欢乐乐地接待他，而且要尊重这样的人；{" "}
              </span>
            </span>
            <span className="verse v30" data-usfm="PHP.2.30">
              <span className="label">30</span>
              <span className="content">
                因他为做基督的工夫，几乎至死，不顾性命，要补足你们供给我的不及之处。
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default ReadingPane;
