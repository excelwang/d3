import "../core/functor";
import "../core/source";
import "../core/target";
import "../math/trigonometry";
import "arc";
import "svg";

d3.svg.chord = function(arrowRatio) {
  var source = d3_source,
      target = d3_target,
      radius = d3_svg_chordRadius,
      startAngle = d3_svg_arcStartAngle,
      endAngle = d3_svg_arcEndAngle;
      if(!arrowRatio) {
        arrowRatio=0;
      }
  // TODO Allow control point to be customized.
  // Modefied by Excel Wang to add arrow to chord!
  function chord(d, i) {
    var s = subgroup(this, source, d, i),
        t = subgroup(this, target, d, i, 1-arrowRatio);
    return "M" + s.p0
      + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t)
      ? curve(s.r, s.p1, s.r, s.p0)
      : curve(s.r, s.p1, t.r, t.p0)
      + (arrowRatio===0?arc(t.r, t.p1, t.a1 - t.a0):arrow(t.pMid,t.p1))
      + curve(t.r, t.p1, s.r, s.p0))
      + "Z";
  }

  // Modefied by Excel Wang to add arrow to chord!
  function subgroup(self, f, d, i,scale) {
    if (!scale){
      scale=1;
    }
    var subgroup = f.call(self, d, i),
        r = radius.call(self, subgroup, i),
        a0 = startAngle.call(self, subgroup, i) - halfπ,
        a1 = endAngle.call(self, subgroup, i) - halfπ,
        aMid=(a1-a0)/2+a0;
    return {
      r: r,
      a0: a0,
      a1: a1,
      p0: [r*scale * Math.cos(a0), r*scale * Math.sin(a0)],
      p1: [r*scale * Math.cos(a1), r*scale * Math.sin(a1)],
      pMid: [r * Math.cos(aMid), r * Math.sin(aMid)]
    };
  }

  function equals(a, b) {
    return a.a0 == b.a0 && a.a1 == b.a1;
  }

  function arc(r, p, a) {
    return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
  }

  function curve(r0, p0, r1, p1) {
    return "Q 0,0 " + p1;
  }

  function arrow(pMid,p1) {
    return "L"+pMid+"L"+p1;
  }

  chord.radius = function(v) {
    if (!arguments.length) return radius;
    radius = d3_functor(v);
    return chord;
  };

  chord.source = function(v) {
    if (!arguments.length) return source;
    source = d3_functor(v);
    return chord;
  };

  chord.target = function(v) {
    if (!arguments.length) return target;
    target = d3_functor(v);
    return chord;
  };

  chord.startAngle = function(v) {
    if (!arguments.length) return startAngle;
    startAngle = d3_functor(v);
    return chord;
  };

  chord.endAngle = function(v) {
    if (!arguments.length) return endAngle;
    endAngle = d3_functor(v);
    return chord;
  };

  return chord;
};

function d3_svg_chordRadius(d) {
  return d.radius;
}
