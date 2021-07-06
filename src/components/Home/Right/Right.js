import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./Right.module.css";
import Divider from "@material-ui/core/Divider";
import Loader from "../../../utils/Loader/Loader";

const Right = () => {
  const [list, setList] = useState([]);
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(true);
  const fixTime = (time) => {
    let temp = new Date(time);
    temp = temp.getTime();
    temp += 330 * 60 * 1000;
    temp = new Date(temp);
    const options = { weekday: "long", month: "long", day: "numeric" };
    return `${temp.toLocaleTimeString("en-US")} ${temp.toLocaleDateString(
      "en-US",
      options
    )}`;
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await axios.get(
          "https://uc-api.herokuapp.com/list/fetch?platforms=cf,cc,go,at,lc,fb&pagenumber=1&itemsperpage=10"
        );
        setList(data.data.data);
        setErr(false);
        setLoader(false);
      } catch (error) {
        setList([]);
        setErr(true);
        setLoader(false);
        console.log(error);
      }
    };
    fetchList();
  }, []);
  return (
    <div className={classes.container}>
      {loader && <Loader />}
      <h2 className={classes.heading}>Upcoming Contests</h2>
      {err === true || list.length === 0 ? (
        <div>Unable to fetch try again later</div>
      ) : (
        list.map((contest, idx) => {
          return (
            <div className={classes.contest} key={`contest${idx}`}>
              <h4>
                <a target="_blank" href={contest.link}>
                  {contest.name}
                </a>
              </h4>
              <p>{fixTime(contest.start)}</p>
              <Divider />
            </div>
          );
        })
      )}
      <div className={classes.footer}>
        <a
          target="_blank"
          href="https://codeforces-comparator.netlify.app/upcoming"
        >
          View More
        </a>
      </div>
    </div>
  );
};

export default Right;
