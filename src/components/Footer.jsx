import "./../../styles/components/Header.scss";

export default class Footer {
    static render() {
        return (
            <div className="footer">
                <div className="author">Developed by O.Popov, 2018</div>
                <div className="sources">
                    <a href="https://github.com/AlexeyPopovUA/geo-points-preview">GitHub sources</a>
                </div>
            </div>
        );
    }
}