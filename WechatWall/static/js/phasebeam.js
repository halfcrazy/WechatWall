(function(n){var r=n("#phasebeam").children("canvas"),x=r[0],B=r[1],C=r[2],D=[157,97,207],E=[255,255,255];if(x.getContext){var d=x.getContext("2d"),s=B.getContext("2d"),p=C.getContext("2d"),m=window.Math,t=20/360*m.PI*2,u=[],v=[],c,f,w;requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||function(a,c){setTimeout(a,1E3/60)};cancelAnimationFrame=window.cancelAnimationFrame||
window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame||window.oCancelAnimationFrame||clearTimeout;var y=function(){c=n(window).width();f=n(window).height();r.each(function(){this.width=c;this.height=f})},z=function(){var a=m.sin(t),g=m.cos(t);s.clearRect(0,0,c,f);for(var d=0,n=u.length;d<n;d++){var e=u[d],h=e.x,k=e.y,b=e.radius,l=e.speed,h=h>c+b?-b:h<-b?c+b:h+a*l,k=k>f+b?-b:k<-b?f+b:k-g*l;e.x=h;e.y=k;var l=e.color,e=e.alpha,q=s.createRadialGradient(h,k,b,
h,k,0);q.addColorStop(0,"rgba("+l[0]+","+l[1]+","+l[2]+","+e+")");q.addColorStop(1,"rgba("+l[0]+","+l[1]+","+l[2]+","+(e-.1)+")");s.beginPath();s.arc(h,k,b,0,2*m.PI,!0);s.fillStyle=q;s.fill()}p.clearRect(0,0,c,f);d=0;for(n=v.length;d<n;d++){e=v[d];h=e.x;k=e.y;b=e.width;l=e.speed;h=h>c+b*a?-b*a:h<-b*a?c+b*a:h+a*l;k=k>f+b*g?-b*g:k<-b*g?f+b*g:k-g*l;e.x=h;e.y=k;var q=b,b=e.color,e=e.alpha,l=h+m.sin(t)*q,q=k-m.cos(t)*q,r=p.createLinearGradient(h,k,l,q);r.addColorStop(0,"rgba("+b[0]+","+b[1]+","+b[2]+","+
e+")");r.addColorStop(1,"rgba("+b[0]+","+b[1]+","+b[2]+","+(e-.1)+")");p.beginPath();p.moveTo(h,k);p.lineTo(l,q);p.lineWidth=3;p.lineCap="round";p.strokeStyle=r;p.stroke()}w=requestAnimationFrame(z)},A=function(){u=[];v=[];for(var a=0;6>a;a++)for(var g=0;3>g;g++)u.push({x:m.random()*c,y:m.random()*f,radius:m.random()*(20+5*g)+(20+5*g),color:D,alpha:.2*m.random()+(.3-.1*g),speed:.5*(1+.5*g)});for(a=0;4>a;a++)for(g=0;3>g;g++)v.push({x:m.random()*c,y:m.random()*f,width:m.random()*(20+5*g)+(20+5*g),color:E,
alpha:.2*m.random()+(.3-.1*g),speed:.5*(1+.5*g)});cancelAnimationFrame(w);w=requestAnimationFrame(z);d.clearRect(0,0,c,f);a=[];a[0]=d.createRadialGradient(.3*c,.1*f,0,.3*c,.1*f,.9*c);a[0].addColorStop(0,"rgb(0, 26, 77)");a[0].addColorStop(1,"transparent");d.translate(c,0);d.scale(-1,1);d.beginPath();d.fillStyle=a[0];d.fillRect(0,0,c,f);a[1]=d.createRadialGradient(.1*c,.1*f,0,.3*c,.1*f,c);a[1].addColorStop(0,"rgb(0, 150, 240)");a[1].addColorStop(.8,"transparent");d.translate(c,0);d.scale(-1,1);d.beginPath();
d.fillStyle=a[1];d.fillRect(0,0,c,f);a[2]=d.createRadialGradient(.1*c,.5*f,0,.1*c,.5*f,.5*c);a[2].addColorStop(0,"rgb(40, 20, 105)");a[2].addColorStop(1,"transparent");d.beginPath();d.fillStyle=a[2];d.fillRect(0,0,c,f)};n(document).ready(function(){y();A()});n(window).resize(function(){y();A()})}})(jQuery);